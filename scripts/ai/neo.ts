import { io, neo } from "@yao/runtime";

/**
 * Neo Prepare hook
 */
function Prepare(ctx: neo.Context, messages: neo.Message[]): neo.Message[] {
  return messages;
}

/**
 * Neo Write hook
 */
function Write(
  ctx: neo.Context,
  messages: neo.Message[],
  response: neo.Response,
  content?: string,
  writer?: io.ResponseWriter
): neo.Response[] {
  return [response];
}
