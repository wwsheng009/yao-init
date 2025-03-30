// import { getWebPageContent } from '@lib/web';
import { neo } from '@yao/neo';

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
          type: 'page',
          props: {
            url: '/index'
          },
          done: true
        },
        true
      );
    }
    return {
      output: [
        { text: '错误的调用，不支持的函数调用：' + funcName }
      ] as neo.ChatMessage[]
    };
  }
}
