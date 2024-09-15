import {Process} from '@yao/yao'
/**
 * 看板数据
 * @cmd yao run scripts.dash.Data
 * @returns
 */
function Data() {
  return Process("flows.stat.data");
}
