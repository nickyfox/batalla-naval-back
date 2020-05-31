import {User} from "../models/User";
import {BoardCell} from "./BoardCell";
import {Ship} from "./Ship";

class Player {

    private _user: User;
    private _board: Array<BoardCell>;
    private _ships: Array<Ship>;
    private _turn: boolean;
    private _positionedShips: boolean


    constructor(user: User, board: Array<BoardCell>, ships: Array<Ship>, turn: boolean, positionedShips: boolean) {
        this._user = user;
        this._board = board;
        this._ships = ships;
        this._turn = turn;
        this._positionedShips = positionedShips;
    }

    get user(): User {
        return this._user;
    }

    get board(): Array<BoardCell> {
        return this._board;
    }

    get ships(): Array<Ship> {
        return this._ships;
    }

    get turn(): boolean {
        return this._turn;
    }

    get positionedShips(): boolean {
        return this._positionedShips;
    }

    set user(value: User) {
        this._user = value;
    }

    set board(value: Array<BoardCell>) {
        this._board = value;
    }

    set ships(value: Array<Ship>) {
        this._ships = value;
    }

    set turn(value: boolean) {
        this._turn = value;
    }

    set positionedShips(value: boolean) {
        this._positionedShips = value;
    }
}


export default Player
