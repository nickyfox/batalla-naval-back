/**
 * This would be the ship of the game
 */
export class Ship {
    id: string;
    pieces: boolean[];
    content: string;

    constructor(id: string, content: string, length: number) {
        this.id = id;
        this.content = content;
        let pieces: boolean[] = [];
        for (let i = 0; i < length; i++) {
            pieces.push(false)
        }
        this.pieces = pieces;
    }
}
