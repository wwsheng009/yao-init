import { Process } from '@yaoapps/client';

export function createTable(id) {
  return Process('scripts._sys.init.CreateTable', id);
}
export function createForm(id) {
  return Process('scripts._sys.init.CreateForm', id);
}

export function updateMenu(id) {
  return Process('scripts._sys.init.updateMenu', id);
}

export function saveModel(id) {
  console.log('save model_id', id);
}
export function deleteModel(id) {
  console.log('delete model_id', id);
}
