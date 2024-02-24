export interface Player {
  name: string;
  password: string;
}

export interface Room {
  roomId: number;
  players: Player[];
}
