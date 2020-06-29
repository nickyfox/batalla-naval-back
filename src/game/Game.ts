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

export interface ShootCellResponse {
    shot: boolean;
    alreadyShotCell: boolean;
}

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

    constructor(user1: User, user2: User) {
        this.player1 = new Player(user1, createEmptyBoard("player1"), initializeShips("player1"), false, false);
        this.player2 = new Player(user2, createEmptyBoard("player2"), initializeShips("player2"), false, false);
    }

    // public isPlayerTurn = (isPlayer1Shooting: boolean): boolean => {
    //     if(isPlayer1Shooting) {
    //         return this.player1.turn;
    //     } else {
    //         return this.player2.turn;
    //     }
    // };
    //
    // public checkIfLost = (player: Player): boolean => {
    //     return player.board.filter(cell => cell.occupied).filter(occupiedCells => !occupiedCells.shot).length === 0;
    // };
    //
    // public shootCell = (cell: BoardCell, isPlayer1Shooting: boolean): ShootCellResponse => {
    //     if(this.player1.turn) {
    //         if(isPlayer1Shooting) {
    //             return this._makeShot(this.player2, cell);
    //         }else {
    //             return {shot: false, alreadyShotCell: false};
    //         }
    //     } else {
    //         if(!isPlayer1Shooting) {
    //             return this._makeShot(this.player1, cell);
    //         }else {
    //             return {shot: false, alreadyShotCell: false};
    //         }
    //     }
    // };
    //
    // private _makeShot(player: Player, cellToShoot: BoardCell): ShootCellResponse {
    //     let newBoard: BoardCell[] = player.board;
    //     let index: number = player.board.findIndex((cell: BoardCell) => cell.id === cellToShoot.id);
    //     if(newBoard[index].shot) {
    //         return {shot: false, alreadyShotCell: true};
    //     }
    //     newBoard[index] = {...newBoard[index], shot: true};
    //     player.board = newBoard;
    //     return {shot: true, alreadyShotCell: false};
    // }
}

export default Game
