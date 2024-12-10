import { io, neo } from '@yao/lib';

/**
 * Neo Prepare hook
 */
export function Prepare(
  ctx: neo.Context,
  messages: neo.Message[]
): neo.Message[] {
  return messages;
}

/**
 * Neo Write hook
 */
export function Write(
  ctx: neo.Context,
  messages: neo.Message[],
  response: neo.Response,
  content?: string,
  writer?: io.ResponseWriter
): neo.Response[] {
  console.log('content', content);
  console.log('writer', writer);
  return [response];
}
