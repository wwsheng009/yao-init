import { Process } from '@yaoapps/client';
import { CachedModel, PaginateDataArray, PaginateSearchResult } from './lib';

/**
 * scripts._sys.model.ModelSearch
 * 模型列表
 */
export function ModelSearch(
  param: YaoQueryParam.QueryParam,
  page: number = 1,
  pagesize: number = 20
): PaginateSearchResult {
  const data = getCachedModelList();
  return PaginateDataArray(data, param, page, pagesize);
}

/**
 * 返回所有缓存中的模型列表
 *
 * yao run scripts._sys.model.getCachedModelList
 * @returns []object
 */
export function getCachedModelList(): CachedModel[] {
  const modelsList = Process('model.list', { metadata: true });

  return modelsList.map((m) => {
    const meta = Process('scripts._sys.init.getModelMeta', m.id);
    if (meta.table_exist) {
      meta.table_url = `/admin/x/Table/${m.id}`;
    }
    if (meta.form_exist) {
      meta.form_url = `/admin/x/Form/${m.id}`;
    }
    return {
      id: m.id,
      name: m.metadata.name,
      ...meta
    };
  });
}
