"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(user, board, ships, turn, positionedShips) {
        this.user = user;
        this.board = board;
        this.ships = ships;
        this.turn = turn;
        this.positionedShips = positionedShips;
    }
}
exports.default = Player;
