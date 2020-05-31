/**
 * This would be the ship of the game
 */
export class Ship {
    id: string;
    pieces: Array<boolean>;

    constructor(id: string, length: number) {
        this.id = id;
        this.pieces = new Array<boolean>(length);
    }
}
