import {User} from "../models/User";
import {BoardCell} from "./BoardCell";
import {Ship} from "./Ship";

class Player {

    user: User;
    board: BoardCell[];
    ships: Ship[];
    turn: boolean;
    positionedShips: boolean;


        constructor(user: User, board: BoardCell[], ships: Ship[], turn: boolean, positionedShips: boolean) {
        this.user = user;
        this.board = board;
        this.ships = ships;
        this.turn = turn;
        this.positionedShips = positionedShips;
    }
}


export default Player
