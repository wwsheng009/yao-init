import { Process } from '@yaoapps/client';

/**
 * Execute a process
 */
export function Exec(id: number, process: string, args: any) {
  const res = Process(process, ...args);
  return { id: id, result: res };
}
