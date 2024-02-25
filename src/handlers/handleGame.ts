import { AddShipsData } from 'utils/types';
import WebSocket from 'ws';

export function handleAddShips(
  ws: WebSocket,
  wss: WebSocket.Server,
  data: string,
) {
  try {
    const parsedData: AddShipsData = JSON.parse(data);
    const { gameId, indexPlayer, ships } = parsedData;
    const response = {
      type: 'ships_added',
      data: JSON.stringify({
        gameId: gameId,
        indexPlayer: indexPlayer,
        ships: ships,
      }),
      id: 0,
    };
    ws.send(JSON.stringify(response));
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: 'ships_added',
            data: JSON.stringify({
              gameId: gameId,
              indexPlayer: indexPlayer,
              ships: ships,
            }),
            id: 0,
          }),
        );
      }
    });
  } catch (error) {
    console.error('Error handling ship placement:', error);
    const errorResponse = {
      type: 'error',
      data: { message: 'Error handling ship placement' },
      id: 0,
    };
    ws.send(JSON.stringify(errorResponse));
  }
}
