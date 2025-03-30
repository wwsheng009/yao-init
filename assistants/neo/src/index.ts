// import { getWebPageContent, truncateText } from '@lib/web';
// import { neo, SendMessage } from '@yao/neo';

/**
 * Creates and initializes a Neo response hook based on input messages and options.
 * Processes message attachments, handles URL content fetching, and manages assistant ID switching.
 *
 * @param input - Array of Neo messages to process
 * @param option - Configuration options object
 * @returns {neo.ResHookInit} Response hook initialization object containing:
 */
export function Create(
  input: neo.Message[],
  option: { [key: string]: any }
): neo.ResHookInit {
  const lastMessage = input[input.length - 1];
  // get the assistant_id from the message text where it looks  "@xxxxx"
  const mentenion_assistant_id = lastMessage.text?.match(/@(\w+)/)?.[1];
  let new_assistant_id = context.assistant_id;
  if (
    mentenion_assistant_id &&
    mentenion_assistant_id !== context.assistant_id
  ) {
    new_assistant_id = mentenion_assistant_id;
    return new_assistant_id;
  }
  return {
    assistant_id: new_assistant_id, //optional,change the assistant_id,switch the assistant for following process
    chat_id: context.chat_id, //optional
    input: input
  };
}
