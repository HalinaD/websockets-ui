import { Player } from './utils/types';

const players: Player[] = [];

export function registerPlayer(
  name: string,
  password: string,
): { index: number | string; error: boolean; errorText: string } {
  const existingPlayer = players.find((player) => player.name === name);
  if (existingPlayer) {
    return {
      index: '',
      error: true,
      errorText: 'Player with this name already exists',
    };
  }
  players.push({ name, password });
  const index = players.length - 1;
  return { index, error: false, errorText: '' };
}
