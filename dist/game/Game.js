"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BoardCell_1 = require("./BoardCell");
const Player_1 = __importDefault(require("./Player"));
const Ship_1 = require("./Ship");
const letterMapping = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e',
    5: 'f',
    6: 'g',
};
function createEmptyBoard(player) {
    let board = [];
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            board.push(new BoardCell_1.BoardCell(`${player}_cell_${i}${letterMapping[j]}`, false, false, null));
        }
    }
    return board;
}
function initializeShips(player) {
    let ships = [];
    ships.push(new Ship_1.Ship(`${player}_ship_1`, `SHIP-1`, 1));
    // ships.push(new Ship(`${player}_ship_2`, `SHIP-2`,1));
    // ships.push(new Ship(`${player}_ship_3`, `SHIP-3`,2));
    // ships.push(new Ship(`${player}_ship_4`, `SHIP-4`,2));
    // ships.push(new Ship(`${player}_ship_5`, `SHIP-5`,3));
    // ships.push(new Ship(`${player}_ship_6`, `SHIP-6`,3));
    return ships;
}
class Game {
    constructor(user1, user2, initialTime) {
        this.player1 = new Player_1.default(user1, createEmptyBoard("player1"), initializeShips("player1"), false, false);
        this.player2 = new Player_1.default(user2, createEmptyBoard("player2"), initializeShips("player2"), false, false);
        this.initialTime = initialTime;
    }
}
exports.default = Game;
