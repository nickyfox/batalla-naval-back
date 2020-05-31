import {BoardCell} from "./BoardCell";
import Player from "./Player";
import {User} from "../models/User";
import {Ship} from "./Ship";

function createEmptyBoard(): Array<BoardCell> {
    return []
}

function initializeShips(): Array<Ship> {
    return []
}

class Game {
    private _player1: Player;
    private _player2: Player;

    constructor(user1: User, user2: User) {
        this._player1 = new Player(user1, createEmptyBoard(), initializeShips(), false, false);
        this._player2 = new Player(user2, createEmptyBoard(), initializeShips(), false, false);
    }


    get player1(): Player {
        return this._player1;
    }

    get player2(): Player {
        return this._player2;
    }


    set player1(value: Player) {
        this._player1 = value;
    }

    set player2(value: Player) {
        this._player2 = value;
    }
}

export default Game
