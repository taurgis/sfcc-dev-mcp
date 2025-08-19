import { BaseToolHandler, ToolExecutionResult } from './base-handler.js';

const CODE_VERSION_TOOL_NAMES = [
  'get_code_versions',
  'activate_code_version',
] as const;

export class CodeVersionToolHandler extends BaseToolHandler {
  canHandle(toolName: string): boolean { return (CODE_VERSION_TOOL_NAMES as readonly string[]).includes(toolName); }
  async handle(toolName: string, args: any, startTime: number): Promise<ToolExecutionResult> {
    if (!this.canHandle(toolName)) { throw new Error(`Unsupported code version tool: ${toolName}`); }
    const { ocapiClient } = this.context;
    if (!ocapiClient) { throw new Error('OCAPI client not configured - ensure credentials are provided in full mode.'); }
    let result: any; let logMessage = '';
    switch (toolName) {
      case 'get_code_versions':
        logMessage = 'Get code versions';
        result = await ocapiClient.getCodeVersions();
        break;
      case 'activate_code_version':
        if (!args?.codeVersionId) { throw new Error('codeVersionId is required'); }
        logMessage = `Activate code version ${args.codeVersionId}`;
        result = await ocapiClient.activateCodeVersion(args.codeVersionId);
        break;
      default:
        throw new Error(`Unknown code version tool: ${toolName}`);
    }
    return this.wrap(toolName, startTime, async () => result, logMessage);
  }
}
