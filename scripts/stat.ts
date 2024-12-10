import { Process, log, Exception } from '@yaoapps/client';
/**
 * before:data hook
 * @cmd  yao run scripts.stat.BeforeData '::{}'
 * @param {*} params
 * @returns
 */
export function BeforeData(params) {
  log.Info('[chart] before data hook: %s', JSON.stringify(params));
  console.log('[chart] before data hook: %s', params);
  return [params];
}

/**
 * after:data hook
 * @cmd  yao run scripts.stat.AfterData '::{"foo":"bar"}'
 * @param {*} data
 * @returns
 */
export function AfterData(data) {
  log.Info('[chart] after data hook: %s', JSON.stringify(data));
  console.log('[chart] after data hook: %s', data);
  return data;
}

/**
 * Compute out
 * @param {*} field
 * @param {*} value
 * @param {*} data
 * @returns
 */
export function Income(field, value, data) {
  log.Info(
    '[chart] Income Compute: %s',
    JSON.stringify({ field: field, value: value, data: data })
  );
  return value;
}

export function OnChange(query) {
  // 进入onchange事件
  query = query || {};
  // const field = query.key;
  const newVal = query.value;
  // const oldVal = query.old;

  const data = { query: query, cost: 2000 };
  if (newVal == 'cat') {
    data.cost = 1000;
  }

  const setting = Process('yao.form.Setting', 'tests.pet');

  if (setting && setting.code && setting.message) {
    throw new Exception(setting.message, 500);
  }

  return {
    data: data,
    setting: setting
  };
}
