/**
 * This would be the ship of the game
 */
export class Ship {
    id: string;
    pieces: Array<boolean>;
    content: string;

    constructor(id: string, content: string, length: number) {
        this.id = id;
        this.content = content;
        let pieces: Array<boolean> = [];
        for (let i = 0; i < length; i++) {
            pieces.push(false)
        }
        this.pieces = pieces;
    }
}
