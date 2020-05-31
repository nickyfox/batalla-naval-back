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
    player1: Player;
    player2: Player;

    constructor(user1: User, user2: User) {
        this.player1 = new Player(user1, createEmptyBoard(), initializeShips(), false, false);
        this.player2 = new Player(user2, createEmptyBoard(), initializeShips(), false, false);
    }
}

export default Game
