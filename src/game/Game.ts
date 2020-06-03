import {BoardCell} from "./BoardCell";
import Player from "./Player";
import {User} from "../models/User";
import {Ship} from "./Ship";

const letterMapping: any = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e',
    5: 'f',
    6: 'g',
};

function createEmptyBoard(isPlayer1: boolean): Array<BoardCell> {
    let board: Array<BoardCell> = [];
    for (let i = 0; i <= 6; i++) {
        for (let j = 0; j <= 6; j++) {
            board.push(new BoardCell(`${i}${letterMapping[j]}`, false, null));
        }
    }
    return board;
}

function initializeShips(): Array<Ship> {
    let ships: Array<Ship> = [];
    for (let i = 0; i <= 5; i++) {
        ships.push(new Ship(`ship_${i}`, 2))
    }
    return ships;
}

class Game {
    player1: Player;
    player2: Player;

    constructor(user1: User, user2: User) {
        this.player1 = new Player(user1, createEmptyBoard(true), initializeShips(), false, false);
        this.player2 = new Player(user2, createEmptyBoard(false), initializeShips(), false, false);
    }
}

export default Game
