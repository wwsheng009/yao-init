//在form与table配置中，yao可以只配置简单的与模型的绑定关系就能带出所有的配置，

import { Exception, FS, Process } from '@yaoapps/client';

/**
 * yao run scripts.studio.init.updateMenu
 * @param modelId model id
 * @returns message
 */
export function updateMenu(modelId) {
  const check = Process('model.exists', modelId);
  if (!check) {
    return {
      message: '模型不存在' + modelId,
      type: 'error'
    };
  }
  const modelInfo = Process('model.get', modelId);

  const filename = `flows/app/menu.flow.yao`;
  const fs = new FS('app');

  if (fs.Exists(filename)) {
    //remove all comment lines in json string
    const text = fs.ReadFile(filename).replace(/\/\/.*\n/g, '');
    const menu = JSON.parse(text);
    // 检查菜单项中是否存在对应的表格路径
    // 查找是否存在相同路径的菜单项
    const existingIndex = menu.output.items.findIndex(
      (x) => x.path === `/x/Table/${modelId}`
    );
    // 创建新的菜单项
    const newMenuItem = {
      icon: 'icon-book',
      name: modelInfo.name,
      badge: 0,
      path: `/x/Table/${modelId}`,
      children: [
        {
          name: modelInfo.name,
          path: `/x/Table/${modelId}`
        }
      ]
    };

    // 如果存在则在原位置更新，否则添加到末尾
    if (existingIndex !== -1) {
      menu.output.items[existingIndex] = newMenuItem;
      fs.WriteFile(filename, JSON.stringify(menu));
      return {
        message: '菜单更新成功:' + modelId,
        type: 'success'
      };
    } else {
      menu.output.items.push(newMenuItem);
      fs.WriteFile(filename, JSON.stringify(menu));
      return {
        message: '菜单创建成功:' + modelId,
        type: 'success'
      };
    }
  } else {
    return {
      message: '菜单配置文件不存在:' + modelId,
      type: 'error'
    };
  }
}

//但是这些配置都是默认项，一般情况是够用了，如果需要更多的配置，就需要手动修改配置文件。
export function MakeDefaultTable(modelId) {
  const filename = `tables/${modelId.split('.').join('/')}.tab.yao`;
  const fs = new FS('app');
  const default1 = {
    name: '::' + modelId,
    action: {
      bind: {
        model: modelId,
        option: {
          withs: {},
          form: modelId //有form才会生成创建按钮
        }
      }
    }
  };
  if (!fs.Exists(filename)) {
    const paths = `tables/${modelId.split('.').join('/')}`.split('/');
    paths.pop();
    const folder = paths.join('/');
    fs.MkdirAll(folder);
    fs.WriteFile(filename, JSON.stringify(default1));
    return false;
  } else {
    return true;
  }
}
export function MakeDefaultForm(modelId) {
  const filename = `forms/${modelId.split('.').join('/')}.form.yao`;
  const fs = new FS('app');
  const default1 = {
    name: '::' + modelId,
    action: {
      bind: {
        model: modelId,
        option: {
          withs: {}
        }
      }
    }
  };
  if (!fs.Exists(filename)) {
    const paths = `tables/${modelId.split('.').join('/')}`.split('/');
    paths.pop();
    const folder = paths.join('/');
    fs.MkdirAll(folder);
    fs.WriteFile(filename, JSON.stringify(default1));
    return false;
  } else {
    return true;
  }
}

/**
 * yao run scripts.studio.init.getModelMeta admin.user
 * @param modelId model id
 * @returns {table_exist:boolean,form_exist:boolean}
 */
function getModelMeta(modelId) {
  return {
    table_exist: checkTableExist(modelId),
    form_exist: checkFormExist(modelId)
  };
}

/**
 * yao run scripts.studio.init.checkTableExist admin.user
 * @param modelId model id
 * @returns boolean
 */
function checkTableExist(modelId) {
  const filename = `tables/${modelId.split('.').join('/')}.tab.yao`;
  const fs = new FS('app');
  if (fs.Exists(filename)) {
    return true;
  } else {
    return false;
  }
}

/**
 * yao run scripts.studio.init.checkFormExist admin.user
 * @param modelId model id
 * @returns boolean
 */
function checkFormExist(modelId) {
  const filename = `forms/${modelId.split('.').join('/')}.form.yao`;
  const fs = new FS('app');
  if (fs.Exists(filename)) {
    return true;
  } else {
    return false;
  }
}
/**
 * 初始化表格的配置文件。
 *
 * yao run scripts.studio.init.CreateTable admin.user
 * @param modelId 表格名称
 */
function CreateTable(modelId) {
  const exist = MakeDefaultTable(modelId);
  if (exist == false) {
    return {
      message: '最小配置已生成，需要生成全配置Table,请再执行一次命令',
      type: 'warning'
    };
  }
  //如果不存在，需要执行两次，要不然yao.table.Setting无法加载文件
  const filename = `tables/${modelId.split('.').join('/')}.tab.yao`;
  // let table_file = `tables/${table.split(".").join("/")}.tab.yao`;
  const setting = Process('yao.table.Setting', modelId);
  if (setting.code && setting.message) {
    return { message: setting.message, type: 'error' };
    // throw new Exception(setting.message, setting.code);
  }
  delete setting['hooks'];
  //重新近排布局
  const newTable = {
    name: '::' + modelId,
    action: {
      bind: {
        model: modelId,
        option: {
          form: modelId,
          withs: {}
        }
      }
    },
    layout: {},
    fields: {}
  };
  const fields = setting.fields;
  delete setting.fields;
  newTable.layout = setting;
  newTable.fields = fields;
  if (newTable.layout) {
    newTable.config = newTable.layout.config;
    delete newTable.layout.config;
    delete newTable.layout.name;
  }
  const createAction = {
    action: [
      {
        type: 'Common.historyPush',
        payload: {
          pathname: `/x/Form/${modelId}/0/edit`
        },
        name: 'HistoryPush'
      }
    ],
    title: '创建',
    width: 3,
    icon: 'icon-plus'
  };
  if (!newTable?.layout) {
    newTable.layout = {};
  }
  if (!newTable?.layout?.filter) {
    newTable.layout.filter = {};
  }
  if (!newTable?.layout?.filter?.actions) {
    newTable.layout.filter.actions = [];
  }
  if (newTable.layout.filter.actions.length == 0) {
    newTable.layout.filter.actions.push(createAction);
  }
  deleteObjectKey(newTable, 'id');
  const fs = new FS('app');
  if (fs.Exists(filename)) {
    //remove all comment lines in json string
    const text = fs.ReadFile(filename).replace(/\/\/.*\n/g, '');
    const template = JSON.parse(text);
    //如果不存在配置，增加，不要直接替换
    newTable.action = template.action;
    newTable.name = template.name;
    // for (const key in template) {
    //   if (!newTable[key]) {
    //     newTable[key] = template[key];
    //   }
    // }
  }
  //make sure the folder exist
  const folder = filename.split('/').slice(0, -1);
  if (!fs.Exists(folder.join('/'))) {
    fs.MkdirAll(folder.join('/'));
  }
  const rc = fs.WriteFile(
    filename.slice(0, -3) + 'default.yao',
    JSON.stringify(newTable)
  );
  if (rc) {
    return { message: '创建表格成功', type: 'success' };
  } else {
    return { message: '创建表格失败', type: 'error' };
  }
}
/**
 * 创建表单的配置文件，适用于初始化表单配置
 * @param modelId 表单名称
 */
function CreateForm(modelId) {
  const exist = MakeDefaultForm(modelId);
  if (exist == false) {
    // console.log('需要生成全配置Form,请再执行一次');
    return {
      message: '最小配置已生成，需要生成全配置Form,请再执行一次命令',
      type: 'warning'
    };
  }
  //如果不存在，需要执行两次，要不然yao.form.Setting无法加载文件
  const filename = `forms/${modelId.split('.').join('/')}.form.yao`;
  const setting = Process('yao.form.Setting', modelId);
  // createSetting(setting, filename);
  if (setting.code && setting.message) {
    throw new Exception(setting.message, setting.code);
  }
  delete setting['hooks'];
  const newForm = {
    //{ [key: string]: any } = {
    name: '::' + modelId,
    action: {
      bind: {
        model: modelId,
        option: {}
      }
    },
    layout: {},
    fields: {}
  };
  const fields = setting.fields;
  delete setting.fields;
  newForm.layout = setting;
  newForm.fields = fields;
  if (newForm.layout) {
    newForm.config = newForm.layout.config;
    delete newForm.layout.config;
    delete newForm.layout.name;
  }
  deleteObjectKey(newForm, 'id');
  // 合并原来的配置
  const fs = new FS('app');
  if (fs.Exists(filename)) {
    //读取文件内容并删除所有注释行
    const text = fs.ReadFile(filename).replace(/\/\/.*\n/g, '');

    const template = JSON.parse(text);
    newForm.action = template.action;
    newForm.name = template.name;
    // for (const key in template) {
    //   if (!newForm[key]) {
    //     newForm[key] = template[key];
    //   }
    // }
  }
  const actions = [
    {
      title: '返回',
      icon: 'icon-arrow-left',
      showWhenAdd: true,
      showWhenView: true,
      action: [
        {
          name: 'CloseModal',
          type: 'Common.closeModal',
          payload: {}
        }
      ]
    },
    {
      title: '保存',
      icon: 'icon-check',
      style: 'primary',
      showWhenAdd: true,
      action: [
        {
          name: 'Submit',
          type: 'Form.submit',
          payload: {}
        },
        {
          name: 'Back',
          type: 'Common.closeModal',
          payload: {}
        }
      ]
    },
    {
      icon: 'icon-trash-2',
      style: 'error',
      title: 'Delete',
      action: [
        {
          name: 'Confirm',
          type: 'Common.confirm',
          payload: {
            title: '确认删除',
            content: '删除后不可撤销！'
          }
        },
        {
          name: 'Delete',
          payload: {
            model: modelId
          },
          type: 'Form.delete'
        },
        {
          name: 'Back',
          type: 'Common.closeModal',
          payload: {}
        }
      ]
    }
  ];
  newForm.layout.actions = actions;
  //make sure the folder exist
  const folder = filename.split('/').slice(0, -1);
  if (!fs.Exists(folder.join('/'))) {
    fs.MkdirAll(folder.join('/'));
  }
  const rc = fs.WriteFile(
    filename.slice(0, -3) + 'default.yao',
    JSON.stringify(newForm)
  );
  console.log('WriteFile：' + rc);
  if (rc) {
    return { message: '创建表单成功', type: 'success' };
  } else {
    return { message: '创建表单失败', type: 'error' };
  }
}
/**
 * delete special key in object
 * @param obj object or arry
 * @param delete_id key to be delete
 * @returns void
 */
function deleteObjectKey(obj, delete_id) {
  if (!(obj instanceof Object) && !(obj instanceof Array)) {
    return;
  }
  if (obj instanceof Array) {
    for (let index = 0; index < obj.length; index++) {
      deleteObjectKey(obj[index], delete_id);
    }
    return;
  }
  for (const key in obj) {
    if (obj[key] instanceof Object) {
      deleteObjectKey(obj[key], delete_id);
    } else if (obj[key] instanceof Array) {
      deleteObjectKey(obj[key], delete_id);
    }
    if (key == delete_id) {
      delete obj[delete_id];
    }
  }
}
/**
 * create default table and table config json file
 * @param model yao model name
 */
function CreateTableAndForm(model) {
  CreateTable(model);
  CreateForm(model);
}

/**
 * get the id list of the cached models 读取所有的模型id的列表
 *
 * yao run scripts.studio.init.getCachedModelIDList
 * @returns list of the cached model ids
 */
export function getCachedModelIDList(): string[] {
  return Process('model.list').map((m) => m.id);
}
/**
 * yao studio run init.CreateTableAndFormForAll
 */
export function CreateTableAndFormForAll() {
  getCachedModelIDList().forEach((m) => {
    CreateTableAndForm(m);
  });
}
//如果不存在，需要执行两次，要不然yao无法加载文件
//直接ts执行

// 使用命令行
// yao run scripts.studio.init.CreateTable admin.user
// yao run scripts.studio.init.CreateForm admin.user
// yao run scripts.studio.init.CreateTableAndForm admin.user
// 创建所有
// yao run scripts.studio.init.CreateTableAndFormForAll
