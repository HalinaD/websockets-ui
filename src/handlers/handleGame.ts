import { AddShipsData, Ship } from 'utils/types';
import WebSocket from 'ws';

let playerShipsPlayer1: Ship[] = [];
let playerShipsPlayer2: Ship[] = [];
let playersReady: number = 0;
const playerConnections = new Map<WebSocket, string>();
export function handleAddShips(
  ws: WebSocket,
  wss: WebSocket.Server,
  data: string,
) {
  try {
    const parsedData: AddShipsData = JSON.parse(data);
    const { gameId, ships, indexPlayer } = parsedData;
    if (indexPlayer === 1) {
      playerShipsPlayer1 = ships;
    } else if (indexPlayer === 2) {
      playerShipsPlayer2 = ships;
    }
    const response = {
      type: 'add_ships',
      data: JSON.stringify(parsedData),
      id: 0,
    };
    ws.send(JSON.stringify(response));
    playersReady++;
    if (playersReady === 2) {
      startGame(wss, playerShipsPlayer1, playerShipsPlayer2);
    }
  } catch (error) {
    console.error('Error handling ship placement:', error);
    const errorResponse = {
      type: 'error',
      data: JSON.stringify({ message: 'Error handling ship placement' }),
      id: 0,
    };
    ws.send(JSON.stringify(errorResponse));
  }
}

function startGame(
  wss: WebSocket.Server,
  playerShipsPlayer1: Ship[],
  playerShipsPlayer2: Ship[],
) {
  const gameStartMessagePlayer1 = {
    type: 'start_game',
    data: JSON.stringify({ ships: playerShipsPlayer1, currentPlayerIndex: 1 }),
    id: 0,
  };
  const gameStartMessagePlayer2 = {
    type: 'start_game',
    data: JSON.stringify({ ships: playerShipsPlayer2, currentPlayerIndex: 2 }),
    id: 0,
  };
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const playerId = playerConnections.get(client);
      if (playerId === '1' || 1) {
        client.send(JSON.stringify(gameStartMessagePlayer1));
      } else if (playerId === '2' || 2) {
        client.send(JSON.stringify(gameStartMessagePlayer2));
      }
    }
  });
}
