import { YaoQueryParam } from '@yaoapps/types';

export interface PaginateSearchResult {
  /**数据记录集合 */
  data: { [key: string]: any }[];
  /**下一页，如没有下一页返回 `-1` */
  next: number;
  /**上一页，如没有上一页返回 `-1` */
  prev: number;
  /**当前页码 */
  page: number;
  /**每页记录数量 */
  pagesize: number;
  /**总页数 */
  pagecnt: number;
  /**总记录数 */
  total: number;
}
export interface CachedModel{
  id:string;
  name:string;
  table:string;
  form:string;
}

function matchWhereCondition(
  item: any,
  where: YaoQueryParam.QueryWhere
): boolean {
  if (!where.column) {
    if (where.wheres && where.wheres.length > 0) {
      return where.method === 'orwhere'
        ? where.wheres.some((w) => matchWhereCondition(item, w))
        : where.wheres.every((w) => matchWhereCondition(item, w));
    }
    return true;
  }

  const value = item[where.column];
  const matchValue = where.value;

  switch (where.op) {
    case 'eq':
    case undefined:
      return value === matchValue;
    case 'ne':
      return value !== matchValue;
    case 'match':
      if (typeof matchValue === 'string' && matchValue.includes('*')) {
        const regexPattern = matchValue
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          .replace(/\\\*/g, '.*');
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(String(value));
      }
      return String(value).includes(String(matchValue));
    case 'like':
      return String(value).includes(String(matchValue));
    case 'gt':
      return value > matchValue;
    case 'ge':
      return value >= matchValue;
    case 'lt':
      return value < matchValue;
    case 'le':
      return value <= matchValue;
    case 'in':
      return Array.isArray(matchValue) && matchValue.includes(value);
    case 'null':
      return value === null || value === undefined;
    case 'notnull':
      return value !== null && value !== undefined;
    default:
      return false;
  }
}

/**
 * 分页查询
 * @param data 数据集合
 * @param param 查询参数
 */
export function PaginateDataArray(
  data: any[],
  param: YaoQueryParam.QueryParam,
  page: number = 1,
  pagesize: number = 20
): PaginateSearchResult {
  // 应用筛选条件
  let filteredData = data;
  if (param.wheres && param.wheres.length > 0) {
    filteredData = data.filter((item) => {
      let result = true;
      let currentGroup: boolean[] = [];
      let lastMethod = 'andwhere';

      for (let i = 0; i < param.wheres!.length; i++) {
        const where = param.wheres![i];
        const currentMatch = matchWhereCondition(item, where);
        const currentMethod = where.method || 'andwhere';

        if (currentMethod === 'orwhere') {
          if (lastMethod !== 'orwhere') {
            // 开始一个新的or组
            currentGroup = [result, currentMatch];
          } else {
            // 继续当前or组
            currentGroup.push(currentMatch);
          }
          result = currentGroup.some((match) => match);
        } else {
          // andwhere
          if (lastMethod === 'orwhere') {
            // 结束前一个or组并开始新的and条件
            result = currentGroup.some((match) => match);
            currentGroup = [];
          }
          result = result && currentMatch;
        }

        lastMethod = currentMethod;
      }

      // 处理最后一个or组
      if (lastMethod === 'orwhere' && currentGroup.length > 0) {
        result = currentGroup.some((match) => match);
      }

      return result;
    });
  }

  // 计算总记录数（在应用limit/offset之前）
  const total = filteredData.length;

  // 应用排序条件
  if (param.orders && param.orders.length > 0) {
    filteredData = [...filteredData].sort((a, b) => {
      for (const order of param.orders!) {
        const column = order.column;
        const option = order.option || 'asc';
        const aValue = a[column];
        const bValue = b[column];

        if (aValue === bValue) continue;

        if (option === 'desc') {
          return bValue > aValue ? 1 : -1;
        } else {
          return aValue > bValue ? 1 : -1;
        }
      }
      return 0;
    });
  } else if (filteredData.length > 0 && filteredData[0].id !== undefined) {
    // 如果没有排序条件且数据中有id字段，则按id升序排序
    filteredData = [...filteredData].sort((a, b) => {
      if (a.id === b.id) return 0;
      return a.id > b.id ? 1 : -1;
    });
  }

  // 计算分页信息
  const pagecnt = Math.ceil(total / pagesize);
  const currentPage = Math.max(1, Math.min(page, pagecnt));
  const startIndex = (currentPage - 1) * pagesize;
  const endIndex = Math.min(startIndex + pagesize, total);

  // 应用偏移量和限制（如果有的话）
  let finalData;
  if (param.offset !== undefined || param.limit !== undefined) {
    const offset = param.offset || 0;
    const limit = param.limit || filteredData.length;
    finalData = filteredData.slice(offset, offset + limit);
  } else {
    // 否则应用分页
    finalData = filteredData.slice(startIndex, endIndex);
  }

  return {
    data: finalData,
    next: currentPage < pagecnt ? currentPage + 1 : -1,
    prev: currentPage > 1 ? currentPage - 1 : -1,
    page: currentPage,
    pagesize: pagesize,
    pagecnt: pagecnt,
    total: total
  };
}
