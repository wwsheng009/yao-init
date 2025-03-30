import { ModelProxy } from '@lib/yao_proxy';
import { IAdminUser } from '@yao/db_types/admin/user';
import { neo } from '@yao/neo';

declare function Send(message: string | object): void;

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
): any | null | string {
  console.log('output');
  console.log(output);
  if (
    output.length > 0 &&
    output[output.length - 1].props != null &&
    output[output.length - 1].props['function'] !== ''
  ) {
    const lastLine = output[output.length - 1];
    const funcName = lastLine.props['function'];

    if (funcName == 'get_weather') {
      console.log('get_weather:');
      Send(
        {
          text: '',
          type: 'page',
          props: {
            url: `/https://wttr.in/${lastLine.props['arguments']['location']}`
          },
          done: true
        },
        true
      );
      return {
        output: [
          {
            text: '完成...',
            type: 'text'
          }
        ]
      };
    } else if (funcName == 'find_user') {
      console.log('find_user:');
      console.log(lastLine.props['arguments']);
      const [user] = new ModelProxy<IAdminUser>('admin.user').Get({
        wheres: [
          {
            column: 'name',
            op: 'like',
            value: `%${lastLine.props['arguments']['username']}%`
          }
        ]
      });
      if (user) {
        console.log(user);
        // 将用户数据转换为markdown格式输出
        const markdown = `## 用户信息
\`\`\`json
${JSON.stringify(user, null, 2)}
\`\`\``;
        Send(
          {
            text: markdown,
            type: 'guide',
            delta: true,
            done: true,
            props: {
              title: '用户信息',
              actions: [
                {
                  namespace: context.pathname,
                  primary: 'id',
                  title: '用户信息',
                  action: [
                    {
                      type: 'Common.confirm',
                      payload: {
                        title: '测试',
                        content: '测试'
                      }
                    }
                  ],
                  name: 'user_info',
                  icon: 'icon-book',
                  data_item: {
                    title: '用户信息',
                    description: '用户信息',
                    icon: 'icon-book',
                    action: 'Common.refresh'
                  }
                }
              ]
            }
          },
          false
        );
        return null;
      } else {
        return {
          output: [{ text: '用户不存在' }] as neo.ChatMessage[]
        };
      }
    }

    return {
      output: [
        { text: '错误的调用，不支持的函数调用：' + funcName }
      ] as neo.ChatMessage[]
    };
  }
}
