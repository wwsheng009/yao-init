//在form与table配置中，yao可以只配置简单的与模型的绑定关系就能带出所有的配置，
//但是这些配置都是默认项，一般情况是够用了，如果需要更多的配置，就需要手动修改配置文件。
function MakeDefaultTable(modelId) {
  let filename = `tables/${modelId.split(".").join("/")}.tab.yao`;
  let fs = new FS("dsl");
  let default1 = {
    name: "::" + modelId,
    action: {
      bind: {
        model: modelId,
        option: {
          withs: {},
          form: modelId, //有form才会生成创建按钮
        },
      },
    },
  };
  if (!fs.Exists(filename)) {
    let paths = `tables/${modelId.split(".").join("/")}`.split("/");
    paths.pop();
    let folder = paths.join("/");
    fs.MkdirAll(folder);
    fs.WriteFile(filename, JSON.stringify(default1));
    console.log("已生成最小化配置Table:", filename);
    return false;
  } else {
    return true;
  }
}
function MakeDefaultForm(modelId) {
  let filename = `forms/${modelId.split(".").join("/")}.form.yao`;
  let fs = new FS("dsl");
  let default1 = {
    name: "::" + modelId,
    action: {
      bind: {
        model: modelId,
        option: {
          withs: {},
        },
      },
    },
  };
  if (!fs.Exists(filename)) {
    let paths = `tables/${modelId.split(".").join("/")}`.split("/");
    paths.pop();
    let folder = paths.join("/");
    fs.MkdirAll(folder);
    fs.WriteFile(filename, JSON.stringify(default1));
    console.log("已生成最小化配置Form:", filename);
    return false;
  } else {
    return true;
  }
}
/**
 * 初始化表格的配置文件。
 * @param modelId 表格名称
 */
function CreateTable(modelId) {
  const exist = MakeDefaultTable(modelId);
  if (exist == false) {
    console.log("需要生成全配置Table,请再执行一次命令");
    return;
  }
  //如果不存在，需要执行两次，要不然yao.table.Setting无法加载文件
  let filename = `tables/${modelId.split(".").join("/")}.tab.yao`;
  // let table_file = `tables/${table.split(".").join("/")}.tab.yao`;
  let setting = Process("yao.table.Setting", modelId);
  if (setting.code && setting.message) {
    throw new Exception(setting.message, setting.code);
  }
  delete setting["hooks"];
  //重新近排布局
  let newTable = {
    name: "::" + modelId,
    action: {
      bind: {
        model: modelId,
        option: {
          form: modelId,
          withs: {},
        },
      },
    },
    layout: {},
    fields: {},
  };
  let fields = setting.fields;
  delete setting.fields;
  newTable.layout = setting;
  newTable.fields = fields;
  if (newTable.layout) {
    newTable.config = newTable.layout.config;
    delete newTable.layout.config;
    delete newTable.layout.name;
  }
  let createAction = {
    action: [
      {
        type: "Common.historyPush",
        payload: {
          pathname: `/x/Form/${modelId}/0/edit`,
        },
        name: "HistoryPush",
      },
    ],
    title: "创建",
    width: 3,
    icon: "icon-plus",
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
  deleteObjectKey(newTable, "id");
  let fs = new FS("dsl");
  if (fs.Exists(filename)) {
    let template = JSON.parse(fs.ReadFile(filename));
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
  let folder = filename.split("/").slice(0, -1);
  if (!fs.Exists(folder.join("/"))) {
    fs.MkdirAll(folder.join("/"));
  }
  let rc = fs.WriteFile(
    filename.slice(0, -3) + "default.yao",
    JSON.stringify(newTable)
  );
  console.log(rc);
}
/**
 * 创建表单的配置文件，适用于初始化表单配置
 * @param modelId 表单名称
 */
function CreateForm(modelId) {
  const exist = MakeDefaultForm(modelId);
  if (exist == false) {
    console.log("需要生成全配置Form,请再执行一次");
    return;
  }
  //如果不存在，需要执行两次，要不然yao.form.Setting无法加载文件
  let filename = `forms/${modelId.split(".").join("/")}.form.yao`;
  let setting = Process("yao.form.Setting", modelId);
  // createSetting(setting, filename);
  if (setting.code && setting.message) {
    throw new Exception(setting.message, setting.code);
  }
  delete setting["hooks"];
  let newForm = {
    //{ [key: string]: any } = {
    name:  "::" + modelId,
    action: {
      bind: {
        model: modelId,
        option: {},
      },
    },
    layout: {},
    fields: {},
  };
  let fields = setting.fields;
  delete setting.fields;
  newForm.layout = setting;
  newForm.fields = fields;
  if (newForm.layout) {
    newForm.config = newForm.layout.config;
    delete newForm.layout.config;
    delete newForm.layout.name;
  }
  deleteObjectKey(newForm, "id");
  // 合并原来的配置
  let fs = new FS("dsl");
  if (fs.Exists(filename)) {
    let template = JSON.parse(fs.ReadFile(filename));
    newForm.action = template.action;
    newForm.name = template.name;
    // for (const key in template) {
    //   if (!newForm[key]) {
    //     newForm[key] = template[key];
    //   }
    // }
  }
  let actions = [
    {
      title: "返回",
      icon: "icon-arrow-left",
      showWhenAdd: true,
      showWhenView: true,
      action: [
        {
          name: "CloseModal",
          type: "Common.closeModal",
          payload: {},
        },
      ],
    },
    {
      title: "保存",
      icon: "icon-check",
      style: "primary",
      showWhenAdd: true,
      action: [
        {
          name: "Submit",
          type: "Form.submit",
          payload: {},
        },
        {
          name: "Back",
          type: "Common.closeModal",
          payload: {},
        },
      ],
    },
    {
      icon: "icon-trash-2",
      style: "danger",
      title: "Delete",
      action: [
        {
          name: "Confirm",
          type: "Common.confirm",
          payload: {
            title: "确认删除",
            content: "删除后不可撤销！",
          },
        },
        {
          name: "Delete",
          payload: {
            model: modelId,
          },
          type: "Form.delete",
        },
        {
          name: "Back",
          type: "Common.closeModal",
          payload: {},
        },
      ],
    },
  ];
  newForm.layout.actions = actions;
  //make sure the folder exist
  let folder = filename.split("/").slice(0, -1);
  if (!fs.Exists(folder.join("/"))) {
    fs.MkdirAll(folder.join("/"));
  }
  let rc = fs.WriteFile(
    filename.slice(0, -3) + "default.yao",
    JSON.stringify(newForm)
  );
  console.log(rc);
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
function test_delete_object_key() {
  let obj = {
    test: {
      id: "test",
    },
    fields: [
      {
        id: "test2",
      },
    ],
  };
  deleteObjectKey(obj, "id");
  console.log(obj);
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
 * 扁平化模型列表
 * @param {object} models yao 模型 嵌套的数据结构
 * @param {string} attr,使用路径表达式抽取子对象
 * @returns
 */
function FlatModelList(models, attr) {
  const list = [];

  const getProperty = (object, path) => {
    const properties = path.split(".");
    let currentObject = object;

    for (let i = 0; i < properties.length; i++) {
      currentObject = currentObject[properties[i]];
    }
    return currentObject;
  };

  const setProperty = (object, path, value) => {
    const properties = path.split(".");
    let currentObject = object;

    for (let i = 0; i < properties.length - 1; i++) {
      if (currentObject === undefined) {
        throw new Error(
          `Property '${properties[i]}' does not exist in path '${path}'`
        );
      }
      //   注意，不支持生成数组
      if (!currentObject.hasOwnProperty(properties[i])) {
        currentObject[properties[i]] = {};
      }
      currentObject = currentObject[properties[i]];
    }

    currentObject[properties[properties.length - 1]] = value;
  };
  let attr2 = [];
  if (typeof attr === "string") {
    // 单个属性
    attr2 = attr.split(",");
  } else if (Array.isArray(attr)) {
    attr2 = attr;
  }
  const traverse = (node) => {
    if (node.children) {
      traverse(node.children);
    } else if (node.data) {
      if (attr != null) {
        const o = {};
        attr2.forEach((a) => {
          const p = getProperty(node.data, a);
          if (p != null) {
            // o[a] = p;
            setProperty(o, a, p);
          }
        });
        list.push(o);
      } else {
        list.push(node.data);
      }
    } else if (Array.isArray(node)) {
      node.forEach((line) => {
        traverse(line);
      });
    }
  };
  traverse(models);
  return list;
}
/**
 * 根据模型ID在缓存中查找模型定义
 * yao studio run init.FindCachedModelById
 * @param {Array} models 模型缓存，保存了所有的模型定义
 * @param {number/string} id 模型标识
 * @returns object | null
 */
function FindCachedModelById(modelId) {
  const models = Process("widget.models");

  const traverse = (node, id) => {
    if (node.children) {
      return traverse(node.children, id);
    } else if (node.data) {
      if (node.data.ID == id) {
        return node.data;
      }
    } else if (Array.isArray(node)) {
      for (const item of node) {
        var obj = traverse(item, id);
        if (obj) {
          return obj;
        }
      }
    }
  };

  return traverse(models, modelId);
}
/**
 * yao studio run init.CreateTableAndFormForAll
 */
function CreateTableAndFormForAll(){
  const models = Process("widget.models");

  const modelIdlist = FlatModelList(models,"ID").map((item) => item.ID)

  modelIdlist.forEach(m=>{
    CreateTableAndForm(m)
  })
}
//如果不存在，需要执行两次，要不然yao无法加载文件
//直接ts执行
// CreateTable("chat.prompt_template1");
// CreateForm("chat.prompt_template");
// CreateTableAndForm("chat.prompt_template");
// 使用命令行
// yao studio run init.CreateTable supplier
// yao studio run init.CreateForm supplier
// yao studio run init.CreateTableAndForm supplier
// 创建所有
// yao studio run init.CreateTableAndFormForAll