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
    let board: BoardCell[] = [];
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            board.push(new BoardCell(`${player}_cell_${i}${letterMapping[j]}`, false,false, null));
        }
    }
    return board;
}

function initializeShips(player: string): Array<Ship> {
    let ships: Ship[] = [];
    ships.push(new Ship(`${player}_ship_1`, `SHIP-1`,1));
    ships.push(new Ship(`${player}_ship_2`, `SHIP-2`,1));
    ships.push(new Ship(`${player}_ship_3`, `SHIP-3`,2));
    ships.push(new Ship(`${player}_ship_4`, `SHIP-4`,2));
    ships.push(new Ship(`${player}_ship_5`, `SHIP-5`,3));
    ships.push(new Ship(`${player}_ship_6`, `SHIP-6`,3));
    return ships;
}

class Game {
    player1: Player;
    player2: Player;
    initialTime: number;

    constructor(user1: User, user2: User, initialTime: number) {
        this.player1 = new Player(user1, createEmptyBoard("player1"), initializeShips("player1"), false, false);
        this.player2 = new Player(user2, createEmptyBoard("player2"), initializeShips("player2"), false, false);
        this.initialTime = initialTime;
    }
}

export default Game
