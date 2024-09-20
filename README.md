# yao-init

用于`Yao`安装器使用的`Yao`应用模板

# YAO 应用

文档: [https://yaoapps.com/doc](https://yaoapps.com/doc)

## 适用于 0.10.4 的 yao 应用程序

内置了`json-schema`检验，使用`vscode`编辑器，在编辑配置文件时会有自动的提示与字段说明。

**注**：需要`vscode`连接`github`

## 使用Typescript开发

在使用最新版本的yao进行开发时，可以使用ts脚本代替js脚本。这个项目模板已经配置好了ts脚本的开发所需要的必要配置，可以像其它nodejs项目一样使用调试功能。
```sh
pnpm i
```

在高度项目之前，需要另开一个终端窗口执行以下命令。
```sh
yao start
```

## 0.10.4 开发版本的 yao 下载

在以下地址下载开发版本 0.10.4 开发版本，根据自己的电脑 OS，打开对应的 URL，找到一个最新的 release

Linux:

https://github.com/YaoApp/yao/actions/workflows/release-linux.yml


MacOS:

https://github.com/YaoApp/yao/actions/workflows/release-macos.yml


## 启动 yao

```sh
git clone --depth 1 https://github.com/wwsheng009/yao-init.git my-yao-app

cd my-yao-app

yao start
```

控制台会提示打开地址http://127.0.0.1:5099进行配置数据库连接

```sh
---------------------------------
Yao Application Setup v0.10.4
---------------------------------

Open URL in the browser to continue:

http://127.0.0.1:5099
```

_不建议直接配置生产系统数据库_

_注意，只有执行目录下没有.env 文件并且数据库为空时才会出现配置界面。_

配置成功后会跳转到后台登录页面，http://127.0.0.1:5099/admin/

## 默认管理员账号

|      |                  |
| ---- | ---------------- |
| 账号 | `xiang@iqka.com` |
| 密码 | `A123456p+`      |

## 环境变量

| 变量名称          | 说明                                                             | 示例                     |
| ----------------- | ---------------------------------------------------------------- | ------------------------ |
| YAO_ENV           | 服务模式 `development` 或 `production`                           | `development`            |
| YAO_HOST          | 服务监听地址 `0.0.0.0`                                           | `127.0.0.1`              |
| YAO_PORT          | 服务监听端口默认为 `5099`                                        | `5066`                   |
| YAO_DB_DRIVER     | 数据库驱动 `sqlite3` 或 `mysql`                                  | `sqlite3`                |
| YAO_DB_PRIMARY    | 数据文件过驱动 DSN                                               | `db/yao.db`              |
| YAO_LANG          | 语言 `en-us`,`zh-ch`                                             | `zh-cn`                  |
| YAO_LOG           | 日志文件地址                                                     | `./logs/application.log` |
| YAO_LOG_MODE      | 日志文件格式 `TEXT` 或 `JSON`                                    | `JSON`                   |
| YAO_SESSION_STORE | 会话存储方式 `file`或 `redis`                                    | `file`                   |
| YAO_SESSION_FILE  | 会话文件地址 `file`或 `redis`                                    | `db/.session`            |
| YAO_STUDIO_PORT   | Studio API 服务端口默认为 `5077`                                 | `5077`                   |
| OPENAI_KEY        | OPENAI API KEY, 可在连接器中更换变量名。 启用 Neo 或 AIGC 必须。 | `sk-xxx`                 |
| YAO_APP_PROXY_ENDPOINT        | 调试项目时需要配置yao服务地址。 | `http://localhost:5099/api/proxy/call`                 |
| YAO_API_ACCESS_KEY        | 调试项目时需要配置的API key。 | `123456`                 |

## 详细文档说明

[https://github.com/wwsheng009/yao-docs](https://github.com/wwsheng009/yao-docs)
