/**
 * This would be the ship of the game
 */
export class Ship {
    id: string;
    content: string;
    length: number;

    constructor(id: string, content: string, length: number) {
        this.id = id;
        this.content = content;
        this.length = length;
    }
}
