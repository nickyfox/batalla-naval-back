import {User} from "../models/User";
import {BoardCell} from "./BoardCell";
import {Ship} from "./Ship";

class Player {

    user: User;
    board: BoardCell[];
    ships: Ship[];
    turn: boolean;
    countdown: number;
    positionedShips: boolean;


    constructor(user: User, board: BoardCell[], ships: Ship[], turn: boolean, countdown: number, positionedShips: boolean) {
        this.user = user;
        this.board = board;
        this.ships = ships;
        this.turn = turn;
        this.countdown = countdown;
        this.positionedShips = positionedShips;
    }
}


export default Player
