import WebSocket from 'ws';

const PORT = 3000;
const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server started on port ${PORT}`);

wss.on('connection', function connection(ws) {
  console.log('connected');
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  ws.on('close', function () {
    console.log('disconnected');
  });
});
