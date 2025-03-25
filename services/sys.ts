import { Process } from '@yaoapps/client';

export function createTable(id) {
  return Process('scripts.studio.init.CreateTable', id);
}
export function createForm(id) {
  return Process('scripts.studio.init.CreateForm', id);
}
