import {Ship} from "./Ship";

export class BoardCell {
    id: string;
    occupied: boolean;
    shot: boolean;
    item: Ship | null;

    constructor(id: string, occupied: boolean, shot: boolean, item: Ship | null) {
        this.id = id;
        this.occupied = occupied;
        this.shot = shot;
        this.item = item;
    }

}
