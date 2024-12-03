import {Process} from '@yao/runtime'
/**
 * 看板数据
 * @cmd yao run scripts.dash.Data
 * @returns
 */
function Data() {
  return Process("flows.stat.data");
}
