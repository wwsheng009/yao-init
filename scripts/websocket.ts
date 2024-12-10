import { WebSocket, Process, log } from '@yaoapps/client';

//yao web socket 客户端

const host = '127.0.0.1:5099';

/**
 * WebSocket Client EventMode(daemon)
 */
export function Event() {
  // const url = `ws://${host}/websocket/chat`;
  // const ws = new WebSocket(url, 'yao-chat-01');
  // // Connection opened
  // ws.on("open", function (event) {
  //   ws.send("Hello Server!", event.data);
  // });
  // // Listen for messages
  // ws.on("message", function (event) {
  //   console.log("Message from server ", event.data);
  //   ws.close(200, "Bye");
  // });
  // // Listen for error
  // ws.on("error", (event) => {
  //   console.log("Message from server ", event);
  // });
  // // Listen for close
  // ws.on("close", (event) => {
  //   console.log("The connection has been closed successfully");
  // });
}

/**
 * WebSocket Client PushMode
 */
export function Push() {
  const url = `ws://${host}/websocket/chat`;
  const ws = new WebSocket(url, 'yao-chat-01');
  const message = ws.push('Hello Server!');
  console.log(message);
}

/**
 * WebSocket Client JWT Auth
 */
export function Token() {
  const token = 'xxx';
  const url = `ws://${host}/websocket/chat?token=${token}`;
  const ws = new WebSocket(url, 'yao-chat-01');
  const message = ws.push('Hello Server!');
  console.log(message);
}

/**
 * WebSocket Client Basic Auth
 */
export function Basic() {
  // Basic Auth username:password
  const user = 'test';
  const password = 'WsTest123**';
  const token = '123';
  const url = `ws://${user}:${password}@${host}/websocket/chat?token=${token}`;
  const ws = new WebSocket(url, 'yao-chat-01');
  const message = ws.push('Hello Server!');
  console.log(message);
}

export function onData(data, recvLen) {
  console.log(`Data: ${data} ${recvLen}`);
  log.Trace('onData: %v %v', data, recvLen);

  if (data == 'World') {
    Process('websocket.Write', 'message', 'Welcome to use websocket');
  }
  if (data[0] == '1') {
    Process('websocket.Close', 'message');
  }
}

export function onError(err) {
  console.log(`Error: ${err} `);
}

export function onClosed(data, err) {
  console.log(`Closed: ${data} ${err} `);
}

export function onConnected(option) {
  console.log('onConnected', option);
  Process('websocket.Write', 'message', 'Hello');
}
