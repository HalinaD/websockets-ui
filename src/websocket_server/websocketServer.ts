import WebSocket from 'ws';
import { handleRegistration } from '../handlers/handleRegistration';
import { handleCreateRoom, handleAddUserToRoom } from '../handlers/handleRoom';
import { handleAddShips } from '../handlers/handleGame';

const PORT = 3000;
const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server started on port ${PORT}`);

wss.on('connection', function connection(ws) {
  console.log('connected');
  ws.on('message', function incoming(message: string) {
    console.log('received: %s', message);
    try {
      const data = JSON.parse(message);
      switch (data.type) {
        case 'reg':
          handleRegistration(ws, data);
          break;
        case 'create_room':
          handleCreateRoom(ws, wss, data.data);
          break;
        case 'add_user_to_room':
          handleAddUserToRoom(ws, wss, data.data);
          break;
        case 'add_ships':
          handleAddShips(ws, wss, data.data);
          break;
        default:
          console.log('Unknown command');
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
  ws.on('close', function () {
    console.log('disconnected');
  });
});
