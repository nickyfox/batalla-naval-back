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

function createEmptyBoard(player: string): Array<BoardCell> {
    let board: Array<BoardCell> = [];
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            board.push(new BoardCell(`${player}_cell_${i}${letterMapping[j]}`, false,false, null));
        }
    }
    return board;
}

function initializeShips(player: string): Array<Ship> {
    let ships: Array<Ship> = [];
    for (let i = 0; i <= 5; i++) {
        ships.push(new Ship(`${player}_ship_${i}`, `SHIP-${i}`,1))
    }
    return ships;
}

class Game {
    player1: Player;
    player2: Player;

    constructor(user1: User, user2: User) {
        this.player1 = new Player(user1, createEmptyBoard("player1"), initializeShips("player1"), false, false);
        this.player2 = new Player(user2, createEmptyBoard("player2"), initializeShips("player2"), false, false);
    }
}

export default Game
