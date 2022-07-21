"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BoardCell {
    constructor(id, occupied, shot, item) {
        this.id = id;
        this.occupied = occupied;
        this.shot = shot;
        this.item = item;
    }
}
exports.BoardCell = BoardCell;
