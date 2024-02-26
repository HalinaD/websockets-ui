import WebSocket from 'ws';
import { RoomManager } from '../roomManager';

const roomManager = new RoomManager();
let globalRoomId: number | undefined;
let creatorId: number | undefined;

export function handleCreateRoom(
  ws: WebSocket,
  wss: WebSocket.Server,
  data: { name: string; password: string },
) {
  const player = { name: data.name, password: data.password };
  globalRoomId = roomManager.createRoom(player);
  if (globalRoomId !== undefined) {
    const roomPlayers = roomManager.getRoomPlayers(globalRoomId);
    creatorId = roomPlayers.length === 1 ? 1 : undefined;
    const roomUsers = roomPlayers.map((player, index) => ({
      name: player.name,
      index: index + 1,
    }));
    ws.send(JSON.stringify({ type: 'create_room', data: '', id: 0 }));
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: 'update_room',
            data: JSON.stringify([{ roomId: globalRoomId, roomUsers }]),
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
  data: { indexRoom: number | string; name: string; password: string },
) {
  let indexRoom: number;
  if (typeof data.indexRoom === 'string') {
    indexRoom = parseInt(data.indexRoom);
  } else {
    indexRoom = data.indexRoom;
  }
  if (globalRoomId !== undefined && !isNaN(globalRoomId)) {
    const player = { name: data.name, password: data.password };
    const success = roomManager.addPlayerToRoom(globalRoomId, player);
    if (success) {
      const roomPlayers = roomManager.getRoomPlayers(globalRoomId);
      const roomUsers = roomPlayers.map((player, index) => ({
        name: player.name,
        index: index + 1,
      }));

      ws.send(
        JSON.stringify({
          type: 'add_user_to_room',
          data: JSON.stringify({ indexRoom: globalRoomId }),
          id: 0,
        }),
      );
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: 'update_room',
              data: JSON.stringify([{ roomId: globalRoomId, roomUsers }]),
              id: 0,
            }),
          );
        }
      });

      if (roomManager.isRoomFull(globalRoomId)) {
        const idGame = Math.floor(Math.random() * 1000);
        roomPlayers.forEach((player, index) => {
          const idPlayer = index + 1;
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: 'create_game',
                  data: JSON.stringify({ idGame, idPlayer }),
                  id: 0,
                }),
              );
            }
          });
        });
      }
    } else {
      ws.send(
        JSON.stringify({
          type: 'error',
          message: 'Failed to add user to the room',
          id: 0,
        }),
      );
    }
  } else {
    ws.send(
      JSON.stringify({ type: 'error', message: 'Invalid room index', id: 0 }),
    );
  }
}
