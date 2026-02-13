/**
 * Script Debugger Handler
 * 
 * Handles SFCC Script Debugger API endpoints for testing script evaluation.
 * Simulates the debugger workflow: create client, set breakpoints, threads, eval, resume.
 */

const express = require('express');

class DebuggerHandler {
    constructor(config) {
        this.config = config;
        this.router = express.Router();
        
        // State management for debugger simulation
        this.debuggerState = {
            clientEnabled: false,
            breakpoints: [],
            threads: [],
            nextBreakpointId: 1,
            nextThreadId: 1,
            pendingHalt: false
        };
        
        this.setupRoutes();
    }

    setupRoutes() {
        const debuggerPath = '/s/-/dw/debugger/v2_0';

        // Create debugger client
        this.router.post(`${debuggerPath}/client`, this.handleCreateClient.bind(this));
        
        // Delete debugger client
        this.router.delete(`${debuggerPath}/client`, this.handleDeleteClient.bind(this));

        // Breakpoints management
        this.router.post(`${debuggerPath}/breakpoints`, this.handleSetBreakpoints.bind(this));
        this.router.delete(`${debuggerPath}/breakpoints`, this.handleDeleteBreakpoints.bind(this));
        this.router.delete(`${debuggerPath}/breakpoints/:id`, this.handleDeleteBreakpoint.bind(this));

        // Thread operations
        this.router.get(`${debuggerPath}/threads`, this.handleGetThreads.bind(this));
        this.router.post(`${debuggerPath}/threads/reset`, this.handleResetThreads.bind(this));
        this.router.post(`${debuggerPath}/threads/:threadId/resume`, this.handleResumeThread.bind(this));
        this.router.post(`${debuggerPath}/threads/:threadId/stop`, this.handleStopThread.bind(this));
        
        // Evaluation
        this.router.get(`${debuggerPath}/threads/:threadId/frames/:frameId/eval`, this.handleEvaluate.bind(this));
    }

    /**
     * Create debugger client session
     */
    handleCreateClient(req, res) {
        if (this.debuggerState.clientEnabled) {
            return res.status(409).json({
                _v: '2.0',
                fault: {
                    type: 'DebuggerAlreadyEnabled',
                    message: 'Debugger is already enabled by another client'
                }
            });
        }

        this.debuggerState.clientEnabled = true;
        this.debuggerState.breakpoints = [];
        this.debuggerState.threads = [];
        this.debuggerState.pendingHalt = false;

        if (this.config.isDevMode) {
            console.log('[Debugger] Client created');
        }

        res.status(204).send();
    }

    /**
     * Delete debugger client session
     */
    handleDeleteClient(req, res) {
        this.debuggerState.clientEnabled = false;
        this.debuggerState.breakpoints = [];
        this.debuggerState.threads = [];
        this.debuggerState.pendingHalt = false;

        if (this.config.isDevMode) {
            console.log('[Debugger] Client deleted');
        }

        res.status(204).send();
    }

    /**
     * Set breakpoints
     */
    handleSetBreakpoints(req, res) {
        if (!this.debuggerState.clientEnabled) {
            return res.status(400).json({
                _v: '2.0',
                fault: {
                    type: 'DebuggerNotEnabled',
                    message: 'Debugger client is not enabled'
                }
            });
        }

        const { breakpoints } = req.body || {};
        
        if (!breakpoints || !Array.isArray(breakpoints)) {
            return res.status(400).json({
                _v: '2.0',
                fault: {
                    type: 'InvalidParameter',
                    message: 'breakpoints array is required'
                }
            });
        }

        const createdBreakpoints = breakpoints.map(bp => {
            const newBp = {
                id: this.debuggerState.nextBreakpointId++,
                line_number: bp.line_number,
                script_path: bp.script_path,
                enabled: true
            };
            this.debuggerState.breakpoints.push(newBp);
            return newBp;
        });

        // Mark that we should create a halted thread on next poll
        this.debuggerState.pendingHalt = true;

        if (this.config.isDevMode) {
            console.log('[Debugger] Breakpoints set:', createdBreakpoints);
        }

        res.json({
            _v: '2.0',
            breakpoints: createdBreakpoints
        });
    }

    /**
     * Delete all breakpoints
     */
    handleDeleteBreakpoints(req, res) {
        this.debuggerState.breakpoints = [];

        if (this.config.isDevMode) {
            console.log('[Debugger] All breakpoints deleted');
        }

        res.status(204).send();
    }

    /**
     * Delete specific breakpoint
     */
    handleDeleteBreakpoint(req, res) {
        const { id } = req.params;
        const index = this.debuggerState.breakpoints.findIndex(bp => bp.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({
                _v: '2.0',
                fault: {
                    type: 'BreakpointNotFound',
                    message: `Breakpoint ${id} not found`
                }
            });
        }

        this.debuggerState.breakpoints.splice(index, 1);

        if (this.config.isDevMode) {
            console.log(`[Debugger] Breakpoint ${id} deleted`);
        }

        res.status(204).send();
    }

    /**
     * Get threads - simulates thread halting at breakpoint
     */
    handleGetThreads(req, res) {
        if (!this.debuggerState.clientEnabled) {
            return res.status(400).json({
                _v: '2.0',
                fault: {
                    type: 'DebuggerNotEnabled',
                    message: 'Debugger client is not enabled'
                }
            });
        }

        // Simulate the thread being created and halted after breakpoint is set
        // First poll returns empty, subsequent polls return halted thread
        if (this.debuggerState.pendingHalt && this.debuggerState.breakpoints.length > 0) {
            // Create a halted thread
            const breakpoint = this.debuggerState.breakpoints[0];
            const thread = {
                id: this.debuggerState.nextThreadId++,
                status: 'halted',
                call_stack: [
                    {
                        index: 0,
                        location: {
                            function_name: 'anonymous',
                            line_number: breakpoint.line_number,
                            script_path: breakpoint.script_path
                        }
                    }
                ]
            };
            this.debuggerState.threads = [thread];
            this.debuggerState.pendingHalt = false;

            if (this.config.isDevMode) {
                console.log('[Debugger] Thread halted at breakpoint:', thread);
            }
        }

        res.json({
            _v: '2.0',
            script_threads: this.debuggerState.threads
        });
    }

    /**
     * Reset threads
     */
    handleResetThreads(req, res) {
        // Reset doesn't clear threads, just resets their internal state
        if (this.config.isDevMode) {
            console.log('[Debugger] Threads reset');
        }

        res.status(204).send();
    }

    /**
     * Resume a halted thread
     */
    handleResumeThread(req, res) {
        const { threadId } = req.params;
        const thread = this.debuggerState.threads.find(t => t.id === parseInt(threadId));
        
        if (!thread) {
            return res.status(404).json({
                _v: '2.0',
                fault: {
                    type: 'ThreadNotFound',
                    message: `Thread ${threadId} not found`
                }
            });
        }

        // Remove the thread (it's resumed and done)
        this.debuggerState.threads = this.debuggerState.threads.filter(t => t.id !== parseInt(threadId));

        if (this.config.isDevMode) {
            console.log(`[Debugger] Thread ${threadId} resumed`);
        }

        res.status(204).send();
    }

    /**
     * Stop a thread
     */
    handleStopThread(req, res) {
        const { threadId } = req.params;
        const thread = this.debuggerState.threads.find(t => t.id === parseInt(threadId));
        
        if (!thread) {
            return res.status(404).json({
                _v: '2.0',
                fault: {
                    type: 'ThreadNotFound',
                    message: `Thread ${threadId} not found`
                }
            });
        }

        // Remove the thread
        this.debuggerState.threads = this.debuggerState.threads.filter(t => t.id !== parseInt(threadId));

        if (this.config.isDevMode) {
            console.log(`[Debugger] Thread ${threadId} stopped`);
        }

        res.status(204).send();
    }

    /**
     * Evaluate expression in halted thread context
     */
    handleEvaluate(req, res) {
        const { threadId, frameId } = req.params;
        const expression = req.query.expr;

        if (!expression) {
            return res.status(400).json({
                _v: '2.0',
                fault: {
                    type: 'InvalidParameter',
                    message: 'expr query parameter is required'
                }
            });
        }

        const thread = this.debuggerState.threads.find(t => t.id === parseInt(threadId));
        
        if (!thread) {
            return res.status(404).json({
                _v: '2.0',
                fault: {
                    type: 'ThreadNotFound',
                    message: `Thread ${threadId} not found`
                }
            });
        }

        if (thread.status !== 'halted') {
            return res.status(400).json({
                _v: '2.0',
                fault: {
                    type: 'ThreadNotHalted',
                    message: `Thread ${threadId} is not halted`
                }
            });
        }

        // Simulate evaluation - try to actually evaluate simple expressions
        let result;
        try {
            // For testing, we simulate specific expressions
            if (expression === '1 + 1') {
                result = '2';
            } else if (expression.includes('Site.current.ID') || expression.includes('Site.getCurrent().ID')) {
                result = 'MockSiteID';
            } else if (expression.includes('ProductMgr.getProduct')) {
                result = 'MockProduct';
            } else if (expression.includes('JSON.stringify')) {
                result = '{"test":"hello"}';
            } else if (expression === 'return 1 + 1;') {
                result = '2';
            } else {
                // Generic mock result for other expressions
                result = 'MockResult';
            }
        } catch (e) {
            return res.status(400).json({
                _v: '2.0',
                fault: {
                    type: 'EvaluationError',
                    message: e.message
                }
            });
        }

        if (this.config.isDevMode) {
            console.log(`[Debugger] Evaluated "${expression}" => "${result}"`);
        }

        res.json({
            _v: '2.0',
            expression: expression,
            result: result
        });
    }

    /**
     * Reset debugger state (for testing)
     */
    resetState() {
        this.debuggerState = {
            clientEnabled: false,
            breakpoints: [],
            threads: [],
            nextBreakpointId: 1,
            nextThreadId: 1,
            pendingHalt: false
        };
    }

    /**
     * Get the configured router
     */
    getRouter() {
        return this.router;
    }
}

module.exports = DebuggerHandler;
