import { Message, Payload, ResHookInit, context } from "@yao/neo";

/**
 * user request -> [Create hook] -> openai
 *
 * called before the chat with openai.
 * 
 * return new assistant_id,chat_id,input messages to change the assistant_id,chat_id,input messages.
 *
 * Creates and initializes a Neo response hook based on input messages and options.
 * Processes message attachments, handles URL content fetching, and manages assistant ID switching.
 *
 * @param input - Array of Neo messages to process
 * @param option - Configuration options object
 * @returns {neo.ResHookInit} Response hook initialization object containing:
 */
export function Create(
  input: Message[],
  option: Payload
): ResHookInit {
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