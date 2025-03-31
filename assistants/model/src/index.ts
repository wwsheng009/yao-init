// import { getWebPageContent } from '@lib/web';
import { neo } from '@yao/neo';
import { FS } from '@yaoapps/client';

declare function Send(message: string | object): void;

/**
 * user request -> [Create hook] -> openai
 *
 * called before the chat with openai.
 *
 * @param input The input message array.
 * @returns A response object containing the next action, input messages, and output data.
 */

export function Create(
  input: neo.Message[],
  option: { [key: string]: any }
): neo.ResHookInit | null | string {
  const lastMessage = input[input.length - 1];

  // get the assistant_id from the message text where it looks  "@xxxxx"
  const mentenion_assistant_id = lastMessage.text?.match(/@(\w+)/)?.[1];
  let new_assistant_id = context.assistant_id;

  if (
    mentenion_assistant_id &&
    mentenion_assistant_id !== context.assistant_id
  ) {
    new_assistant_id = mentenion_assistant_id;
  }

  //case 3 returns an object
  return {
    assistant_id: new_assistant_id, //optional,change the assistant_id,switch the assistant for following process
    chat_id: context.chat_id, //optional
    input: input //optional,修改 the input messages
  };
}

/**
 * called only once, when the call openai api done,open ai return messages
 *
 * @param input input messages
 * @param output messages
 * @returns
 */
export function Done(
  input: neo.ChatMessage[],
  output: neo.ChatMessage[]
): neo.ResHookDone | null {
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
          },
          done: true
        },
        true
      );
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
        fs.WriteFile('temp/' + model_id + '.yao', source);
        // Process('model.create', dsl);

        // 将用户数据转换为markdown格式输出

        Send(
          {
            text: desc,
            type: 'guide',
            done: true,
            props: {
              title: '模型信息',
              actions: [
                {
                  namespace: context.pathname,
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
                  namespace: context.pathname,
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
        ] as neo.ChatMessage[]
      };
    }
  }
}
