import { WebSocket } from '@yaoapps/client';
/**
 * yao js web socket client
 * 发送通知
 * @param {*} data
 */
export function Notify(data) {
  const socket = new WebSocket(
    'ws://localhost:5099/websocket/message',
    'yao-message-01'
  );
  socket.push(JSON.stringify(data));
}
