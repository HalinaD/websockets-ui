import WebSocket from 'ws';
import { RoomManager } from '../roomManager';

const roomManager = new RoomManager();

export function handleCreateRoom(
  ws: WebSocket,
  wss: WebSocket.Server,
  data: { name: string; password: string },
) {
  const player = { name: data.name, password: data.password };
  const roomId = roomManager.createRoom(player);
  if (roomId !== undefined) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: 'update_room',
            data: JSON.stringify([
              { roomId, roomUsers: [{ name: player.name, index: 1 }] },
            ]),
            id: 0,
          }),
        );
      }
    });
  }
}

export function handleAddUserToRoom(
  ws: WebSocket,
  wss: WebSocket.Server,
  data: { name: string; password: string },
) {
  const playerToAdd = { name: data.name, password: data.password };
  const roomId = roomManager.getRoomIdForPlayer(playerToAdd);
  if (roomId !== undefined) {
    const success = roomManager.addPlayerToRoom(roomId, playerToAdd);
    if (success) {
      const roomPlayers = roomManager.getRoomPlayers(roomId);
      if (roomManager.isRoomFull(roomId)) {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'create_game',
                data: JSON.stringify({ ships: [], currentPlayerIndex: 1 }),
                id: 0,
              }),
            );
          }
        });
      }
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: 'update_room',
              data: JSON.stringify([{ roomId, roomUsers: roomPlayers }]),
              id: 0,
            }),
          );
        }
      });
    } else {
      console.log('Failed to add player to room');
    }
  } else {
    console.log('Room not found for player');
  }
}
