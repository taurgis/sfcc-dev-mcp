import { Logger } from '../../utils/logger.js';

export interface HandlerContext {
  logger: Logger;
  logClient?: any;
  docsClient: any;
  bestPracticesClient: any;
  sfraClient: any;
  ocapiClient?: any;
  cartridgeGenerator?: any;
}

export interface ToolExecutionResult {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

export abstract class BaseToolHandler {
  protected context: HandlerContext;
  protected logger: Logger;

  constructor(context: HandlerContext, subLoggerName: string) {
    this.context = context;
    this.logger = Logger.getChildLogger(`Handler:${subLoggerName}`);
  }

  abstract canHandle(toolName: string): boolean;
  abstract handle(toolName: string, args: any, startTime: number): Promise<ToolExecutionResult>;

  protected createResponse(data: any, stringify: boolean = true): ToolExecutionResult {
    return {
      content: [
        { type: 'text', text: stringify ? JSON.stringify(data) : data },
      ],
    };
  }

  protected async wrap(
    toolName: string,
    startTime: number,
    fn: () => Promise<any>,
    logMessage?: string,
  ): Promise<ToolExecutionResult> {
    if (logMessage) {
      this.logger.debug(logMessage);
    }
    const result = await fn();
    this.logger.timing(toolName, startTime);
    return this.createResponse(result);
  }
}
