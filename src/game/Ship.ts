/**
 * This would be the ship of the game
 */
export class Ship {
    private _id: string;
    private _pieces: Array<boolean>;


    constructor(id: string, length: number) {
        this._id = id;
        this._pieces = new Array<boolean>(length);
    }


    get id(): string {
        return this._id;
    }

    get pieces(): Array<boolean> {
        return this._pieces;
    }


    set id(value: string) {
        this._id = value;
    }

    set pieces(value: Array<boolean>) {
        this._pieces = value;
    }
}
