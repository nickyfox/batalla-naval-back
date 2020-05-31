/**
 * id = como ya lo tengo
 *
 */


export class BoardCell {
    private _id: string;
    private _occupied: boolean;


    constructor(id: string, occupied: boolean) {
        this._id = id;
        this._occupied = occupied;
    }


    get id(): string {
        return this._id;
    }

    get occupied(): boolean {
        return this._occupied;
    }


    set id(value: string) {
        this._id = value;
    }

    set occupied(value: boolean) {
        this._occupied = value;
    }
}
