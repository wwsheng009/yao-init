import { Process } from '@yaoapps/client';
/**
 * 看板数据
 * @cmd yao run scripts.dash.Data
 * @returns
 */
export function Data() {
  return Process('flows.stat.data');
}
