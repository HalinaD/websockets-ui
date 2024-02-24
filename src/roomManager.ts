import { Player, Room } from './utils/types';

export class RoomManager {
  private rooms: Room[] = [];
  private currentRoomId: number = 0;

  public createRoom(player: Player): number {
    this.currentRoomId++;
    this.rooms.push({ roomId: this.currentRoomId, players: [player] });
    return this.currentRoomId;
  }

  public addPlayerToRoom(roomId: number, player: Player): boolean {
    const room = this.rooms.find((room) => room.roomId === roomId);
    if (room) {
      room.players.push(player);
      return true;
    }
    return false;
  }

  public getRoomPlayers(roomId: number): Player[] {
    const room = this.rooms.find((room) => room.roomId === roomId);
    return room ? room.players : [];
  }

  public getRooms(): Room[] {
    return this.rooms;
  }

  public getRoomIdForPlayer(player: Player): number | undefined {
    const room = this.rooms.find((room) =>
      room.players.some((p) => p.name === player.name),
    );
    return room ? room.roomId : undefined;
  }

  public isRoomFull(roomId: number): boolean {
    const room = this.rooms.find((room) => room.roomId === roomId);
    return room ? room.players.length >= 2 : false;
  }
}
