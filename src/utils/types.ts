export interface Player {
  name: string;
  password: string;
}

export interface Room {
  roomId: number;
  players: Player[];
}

export interface Ship {
  position: { x: number; y: number };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export interface AddShipsData {
  gameId: number | string;
  ships: Ship[];
  indexPlayer: number | string;
}
