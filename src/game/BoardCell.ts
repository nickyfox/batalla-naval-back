import {Ship} from "./Ship";

export class BoardCell {
    id: string;
    occupied: boolean;
    ship: Ship | null;

    constructor(id: string, occupied: boolean, ship: Ship | null) {
        this.id = id;
        this.occupied = occupied;
        this.ship = ship;
    }

}
