// import { getWebPageContent } from '@lib/web';
import { Message, ResHookDone, context, Send, ResHookFail, ResHookRrety, Payload } from '@yao/neo';
import { FS } from '@yaoapps/client';


export function Retry(lastInput: string, output: Message[], errorMessage: string): ResHookRrety {
  return null
}
/**
 * called only once, when the call openai api done,open ai return messages
 *
 * @param input user input messages
 * @param output ai model response messages
 * 
 * context is the yao neo context, you can get the context from the context object, such as the assistant_id, chat_id, etc.
 * @returns
 */
export function Done(
  input: Message[],
  output: Message[]
): ResHookDone {
  console.log('output');
  console.log(output);
  if (
    output.length > 0 &&
    output[output.length - 1].props != null &&
    output[output.length - 1].props['function'] !== ''
  ) {
    const lastLine = output[output.length - 1];
    const funcName = lastLine.props['function'];

    if (funcName == 'model_list') {
      Send(
        {
          text: '',
          type: 'action',
          props: {
            action: [
              {
                type: 'Common.emitEvent',
                payload: {
                  key: 'app/openSidebar',
                  value: true
                }
              },
              {
                type: 'Common.historyPush',
                name: 'historyPush',
                payload: {
                  pathname: '/x/Table/_sys.model'
                }
              }
            ]
          }
        },
        true
      );
      return {
        output: [{
          text: '处理完成'
        }]
      }
      // Send(
      //   {
      //     text: '',
      //     type: 'page',
      //     props: {
      //       url: '/admin/x/Table/_sys.model'
      //     },
      //     done: true
      //   },
      //   true
      // );
    } else if (funcName == 'save_model') {
      const source = lastLine.props['arguments']['source'];
      const model_id = lastLine.props['arguments']['model_id'];
      const desc = lastLine.props['arguments']['desc'];
      try {
        const fs = new FS('data');
        // const dsl = JSON.parse(source);
        fs.WriteFile('temp/' + model_id + '.mod.yao', source);
        // Process('model.create', dsl);

        // 将用户数据转换为markdown格式输出
        // 
        Send(
          {
            text: desc,
            type: 'guide',
            done: true,
            props: {
              title: '模型信息',
              actions: [
                {
                  namespace: context.path,
                  primary: 'id',
                  title: '保存模型',
                  action: [
                    {
                      type: 'Common.confirm',
                      payload: {
                        title: '保存模型',
                        content: '保存模型'
                      }
                    },
                    {
                      type: 'Service.sys',
                      name: 'saveModel',
                      payload: {
                        args: [model_id], //使用{{}}的语法传入参数
                        method: 'saveModel'
                      }
                    },
                    {
                      type: 'Common.emitEvent',
                      payload: {
                        key: 'app/openSidebar',
                        value: true
                      }
                    },
                    {
                      type: 'Common.historyPush',
                      name: 'historyPush',
                      payload: {
                        pathname: '/x/Table/_sys.model'
                      }
                    }
                  ],
                  name: 'model_save',
                  icon: 'icon-save'
                },
                {
                  namespace: context.path,
                  primary: 'id',
                  title: '删除模型',
                  action: [
                    {
                      type: 'Common.confirm',
                      payload: {
                        title: '删除模型',
                        content: '删除模型'
                      }
                    },
                    {
                      type: 'Service.sys',
                      name: 'deleteModel',
                      payload: {
                        args: [model_id], //使用{{}}的语法传入参数
                        method: 'deleteModel'
                      }
                    }
                  ],
                  name: 'model_delete',
                  icon: 'icon-delete'
                }
              ]
            }
          },
          true
        );
        return {
          output: [{
            text: '处理完成'
          }]
        }
      } catch (error) {
        Send({
          text: '创建模型失败：' + error,
          type: 'text',
          done: true
        });
      }
    } else {
      return {
        output: [
          { text: '错误的调用，不支持的函数调用：' + funcName }
        ]
      };
    }
  }
}
export function Fail(
  input: Message,
  errorMessage: string): ResHookFail {
  return {
    output: "failed to call openai api",
    error: errorMessage,
    next: null,
  }
}