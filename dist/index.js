"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const http_1 = __importDefault(require("http"));
const Game_1 = __importDefault(require("./game/Game"));
const socketio = require("socket.io");
const user_services_1 = require("./services/user.services");
const timer_1 = require("./timer");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const port = process.env.PORT || "8000";
        const app = new app_1.App(port);
        const server = http_1.default.createServer(app.app);
        const io = socketio.listen(server, {
            cors: {
                origin: ["http://localhost:8000", "https://batalla-naval-dipoi.herokuapp.com"]
            }
        });
        io.on('connection', (socket) => {
            console.log("Socket connected " + socket.id);
            let game;
            socket.on('message', (info) => {
                console.log("MESSAGE SENT");
                socket.to(info.room).emit('message', {
                    body: info.message.body,
                    from: info.message.from
                });
            });
            socket.on("only_join_game_room", (info) => {
                console.log("ONLY JOIN GAME ROOM");
                game = info.game;
                socket.join(`game_room_${info.userNotWaiting}_${info.userWaiting}`);
            });
            socket.on("join_game_room_then_send", (users) => __awaiter(this, void 0, void 0, function* () {
                const user1 = yield user_services_1.findUserById(users.userWaiting);
                const user2 = yield user_services_1.findUserById(users.userNotWaiting);
                game = new Game_1.default(Object.assign({}, user1[0]), Object.assign({}, user2[0]), new Date().getTime());
                console.log("JOIN GAME ROOM FOR ", users);
                socket.join(`game_room_${users.userNotWaiting}_${users.userWaiting}`);
                io.emit('sendToGameRoom', {
                    userWaitingId: users.userWaiting,
                    userNotWaitingId: users.userNotWaiting,
                    room: `game_room_${users.userNotWaiting}_${users.userWaiting}`,
                    game: game
                });
            }));
            socket.on("leave room", (info) => {
                console.log("LEFT ROOM");
                socket.to(info.room).emit('player left game');
                socket.leave(info.room);
            });
            // ----------- GAME MESSAGES ------------------
            socket.on('send board with placed ships for player 1', (info) => {
                console.log("send board with placed ships for player 1: ");
                // if(info.board.filter(cells => cells.occupied).length === 0) {
                //     socket.emit("no positioned ships");
                //     return;
                // }
                // if(info.ships.length !== 0){
                //     socket.emit("not positioned all ships");
                //     return;
                // }
                game = Object.assign(Object.assign({}, game), { player1: Object.assign(Object.assign({}, game.player1), { positionedShips: true, turn: game.player2.positionedShips, board: info.board }) });
                io.to(info.room).emit("update game player 1", game.player1);
                if (game.player2.positionedShips)
                    timer_1.TaskScheduler.start({
                        id: `${info.room}`,
                        onTick: (i) => io.to(info.room).emit('currentTime', { currentTime: 15 - i }),
                        onTimeout: () => shootRandomCell(info.room, true),
                        maxIterations: 15,
                        interval: 1000
                    });
            });
            socket.on('send board with placed ships for player 2', (info) => {
                console.log("send board with placed ships for player 2: ");
                // if(info.board.filter(cells => cells.occupied).length === 0) {
                //     socket.emit("no positioned ships");
                //     return;
                // }
                //
                // if(info.ships.length !== 0){
                //     socket.emit("not positioned all ships");
                //     return;
                // }
                game = Object.assign(Object.assign({}, game), { player2: Object.assign(Object.assign({}, game.player2), { turn: game.player1.positionedShips, positionedShips: true, board: info.board }) });
                io.to(info.room).emit("update game player 2", game.player2);
                if (game.player1.positionedShips)
                    timer_1.TaskScheduler.start({
                        id: `${info.room}`,
                        onTick: (i) => io.to(info.room).emit('currentTime', { currentTime: 15 - i }),
                        onTimeout: () => shootRandomCell(info.room, false),
                        maxIterations: 15,
                        interval: 1000
                    });
            });
            /**
             * Game update required for the client
             */
            socket.on("update game", (newGame) => {
                game = Object.assign({}, newGame);
                console.log("UPDATE GAME");
            });
            /**
             * When client first enters the Game Page the game has to be sent to them
             */
            socket.on("receive game", (room) => {
                console.log("RECEIVE GAME: ", room);
                socket.to(room).emit("update game", game);
            });
            socket.on("shoot cell", (info) => {
                if (info.isPlayer1Shooting) {
                    console.log("SHOOT PLAYER 2: ", info.cell);
                    if (!game.player1.turn) {
                        console.log("NOT PLAYER 1 TURN");
                        socket.emit("not your turn");
                        return;
                    }
                    let newBoard = game.player2.board;
                    let index = game.player2.board.findIndex((cell) => cell.id === info.cell.id);
                    if (newBoard[index].shot) {
                        socket.emit("already shot cell");
                        return;
                    }
                    newBoard[index] = Object.assign(Object.assign({}, newBoard[index]), { shot: true });
                    timer_1.TaskScheduler.cancel(`${info.room}`);
                    if (game.player2.board.filter(cell => cell.occupied).filter(occupiedCells => !occupiedCells.shot).length === 0) {
                        console.log("PLAYER 1 WON");
                        user_services_1.saveMatchHistory({ winner_id: game.player1.user.id }, { loser_id: game.player2.user.id }, game.initialTime).then(() => {
                            io.to(info.room).emit("player 1 won", { winner: game.player1, loser: game.player2 });
                        });
                    }
                    else {
                        if (newBoard[index].occupied) {
                            game = Object.assign(Object.assign({}, game), { player1: Object.assign(Object.assign({}, game.player1), { turn: true }), player2: Object.assign(Object.assign({}, game.player2), { turn: false, board: newBoard }) });
                            timer_1.TaskScheduler.start({
                                id: `${info.room}`,
                                onTick: (i) => io.to(info.room).emit('currentTime', { currentTime: 15 - i }),
                                onTimeout: () => shootRandomCell(info.room, true),
                                maxIterations: 15,
                                interval: 1000
                            });
                        }
                        else {
                            game = Object.assign(Object.assign({}, game), { player1: Object.assign(Object.assign({}, game.player1), { turn: false }), player2: Object.assign(Object.assign({}, game.player2), { turn: true, board: newBoard }) });
                            timer_1.TaskScheduler.start({
                                id: `${info.room}`,
                                onTick: (i) => io.to(info.room).emit('currentTime', { currentTime: 15 - i }),
                                onTimeout: () => shootRandomCell(info.room, false),
                                maxIterations: 15,
                                interval: 1000
                            });
                        }
                    }
                    io.to(info.room).emit("update game", game);
                }
                else {
                    console.log("SHOOT PLAYER 1: ", info.cell);
                    if (!game.player2.turn) {
                        console.log("NOT PLAYER 2 TURN");
                        socket.emit("not your turn");
                        return;
                    }
                    let newBoard = game.player1.board;
                    let index = game.player1.board.findIndex((cell) => cell.id === info.cell.id);
                    if (newBoard[index].shot) {
                        socket.emit("already shot cell");
                        return;
                    }
                    newBoard[index] = Object.assign(Object.assign({}, newBoard[index]), { shot: true });
                    timer_1.TaskScheduler.cancel(`${info.room}`);
                    if (game.player1.board.filter(cell => cell.occupied).filter(occupiedCells => !occupiedCells.shot).length === 0) {
                        console.log("PLAYER 2 WON");
                        user_services_1.saveMatchHistory({ winner_id: game.player2.user.id }, { loser_id: game.player1.user.id }, game.initialTime).then(() => {
                            io.to(info.room).emit("player 2 won", { winner: game.player2, loser: game.player1 });
                        });
                    }
                    else {
                        if (newBoard[index].occupied) {
                            game = Object.assign(Object.assign({}, game), { player2: Object.assign(Object.assign({}, game.player2), { turn: true }), player1: Object.assign(Object.assign({}, game.player1), { turn: false, board: newBoard }) });
                            timer_1.TaskScheduler.start({
                                id: `${info.room}`,
                                onTick: (i) => io.to(info.room).emit('currentTime', { currentTime: 15 - i }),
                                onTimeout: () => shootRandomCell(info.room, false),
                                maxIterations: 15,
                                interval: 1000
                            });
                        }
                        else {
                            game = Object.assign(Object.assign({}, game), { player2: Object.assign(Object.assign({}, game.player2), { turn: false }), player1: Object.assign(Object.assign({}, game.player1), { turn: true, board: newBoard }) });
                            timer_1.TaskScheduler.start({
                                id: `${info.room}`,
                                onTick: (i) => io.to(info.room).emit('currentTime', { currentTime: 15 - i }),
                                onTimeout: () => shootRandomCell(info.room, true),
                                maxIterations: 15,
                                interval: 1000
                            });
                        }
                    }
                    io.to(info.room).emit("update game", game);
                }
            });
            socket.on("shoot random cell", (info) => {
                timer_1.TaskScheduler.cancel(`${info.room}`);
                shootRandomCell(info.room, info.isPlayer1Shooting);
            });
            socket.on("player wants rematch", (info) => {
                if (info.isPlayer1) {
                    io.to(info.room).emit("player 1 wants rematch");
                }
                else {
                    io.to(info.room).emit("player 2 wants rematch");
                }
            });
            socket.on("rematch", (info) => {
                game = new Game_1.default(game.player1.user, game.player2.user, new Date().getTime());
                io.to(info.room).emit("restart game", game);
            });
            socket.on("quit game", (info) => {
                if (info.isPlayer1) {
                    timer_1.TaskScheduler.clear();
                    socket.to(info.room).emit('player left game');
                    socket.leave(info.room);
                    user_services_1.saveMatchHistory({ winner_id: game.player2.user.id }, { loser_id: game.player1.user.id }, game.initialTime).then(() => {
                        io.to(info.room).emit("player 2 won", { winner: game.player2, loser: game.player1 });
                    });
                }
                else {
                    timer_1.TaskScheduler.clear();
                    socket.to(info.room).emit('player left game');
                    socket.leave(info.room);
                    user_services_1.saveMatchHistory({ winner_id: game.player1.user.id }, { loser_id: game.player2.user.id }, game.initialTime).then(() => {
                        io.to(info.room).emit("player 1 won", { winner: game.player1, loser: game.player2 });
                    });
                }
            });
            socket.on('leaving game', (info) => {
                socket.to(info.room).emit('player left game');
                socket.leave(info.room);
            });
            function shootRandomCell(room, isPlayer1) {
                console.log("RANDOM SHOOT");
                if (isPlayer1) {
                    if (!game.player1.turn) {
                        console.log("NOT PLAYER 1 TURN");
                        socket.emit("not your turn");
                        return;
                    }
                    let newBoard = game.player2.board;
                    let filteredBoard = game.player2.board.filter((cell) => !cell.shot);
                    const randomIndex = Math.floor(Math.random() * (filteredBoard.length));
                    const shotCell = filteredBoard[randomIndex];
                    const index = newBoard.findIndex(cell => cell.id === shotCell.id);
                    newBoard[index] = Object.assign(Object.assign({}, shotCell), { shot: true });
                    if (game.player2.board.filter(cell => cell.occupied).filter(occupiedCells => !occupiedCells.shot).length === 0) {
                        console.log("PLAYER 1 WON");
                        user_services_1.saveMatchHistory({ winner_id: game.player1.user.id }, { loser_id: game.player2.user.id }, game.initialTime).then(() => {
                            io.to(room).emit("player 1 won", { winner: game.player1, loser: game.player2 });
                        });
                    }
                    if (newBoard[index].occupied) {
                        game = Object.assign(Object.assign({}, game), { player1: Object.assign(Object.assign({}, game.player1), { turn: true }), player2: Object.assign(Object.assign({}, game.player2), { turn: false, board: newBoard }) });
                        timer_1.TaskScheduler.start({
                            id: `${room}`,
                            onTick: (i) => io.to(room).emit('currentTime', { currentTime: 15 - i }),
                            onTimeout: () => shootRandomCell(room, true),
                            maxIterations: 15,
                            interval: 1000
                        });
                    }
                    else {
                        game = Object.assign(Object.assign({}, game), { player1: Object.assign(Object.assign({}, game.player1), { turn: false }), player2: Object.assign(Object.assign({}, game.player2), { turn: true, board: newBoard }) });
                        timer_1.TaskScheduler.start({
                            id: `${room}`,
                            onTick: (i) => io.to(room).emit('currentTime', { currentTime: 15 - i }),
                            onTimeout: () => shootRandomCell(room, false),
                            maxIterations: 15,
                            interval: 1000
                        });
                    }
                    io.to(room).emit("update game", game);
                }
                else {
                    if (!game.player2.turn) {
                        console.log("NOT PLAYER 2 TURN");
                        socket.emit("not your turn");
                        return;
                    }
                    let newBoard = game.player1.board;
                    let filteredBoard = game.player1.board.filter((cell) => !cell.shot);
                    const randomIndex = Math.floor(Math.random() * (filteredBoard.length));
                    const shotCell = filteredBoard[randomIndex];
                    const index = newBoard.findIndex(cell => cell.id === shotCell.id);
                    newBoard[index] = Object.assign(Object.assign({}, shotCell), { shot: true });
                    if (game.player1.board.filter(cell => cell.occupied).filter(occupiedCells => !occupiedCells.shot).length === 0) {
                        console.log("PLAYER 2 WON");
                        user_services_1.saveMatchHistory({ winner_id: game.player2.user.id }, { loser_id: game.player1.user.id }, game.initialTime).then(() => {
                            io.to(room).emit("player 2 won", { winner: game.player2, loser: game.player1 });
                        });
                    }
                    if (newBoard[index].occupied) {
                        game = Object.assign(Object.assign({}, game), { player2: Object.assign(Object.assign({}, game.player2), { turn: true }), player1: Object.assign(Object.assign({}, game.player1), { turn: false, board: newBoard }) });
                        timer_1.TaskScheduler.start({
                            id: `${room}`,
                            onTick: (i) => io.to(room).emit('currentTime', { currentTime: 15 - i }),
                            onTimeout: () => shootRandomCell(room, false),
                            maxIterations: 15,
                            interval: 1000
                        });
                    }
                    else {
                        game = Object.assign(Object.assign({}, game), { player2: Object.assign(Object.assign({}, game.player2), { turn: false }), player1: Object.assign(Object.assign({}, game.player1), { turn: true, board: newBoard }) });
                        timer_1.TaskScheduler.start({
                            id: `${room}`,
                            onTick: (i) => io.to(room).emit('currentTime', { currentTime: 15 - i }),
                            onTimeout: () => shootRandomCell(room, true),
                            maxIterations: 15,
                            interval: 1000
                        });
                    }
                    io.to(room).emit("update game", game);
                }
            }
        });
        yield server.listen(app.app.get('port'), () => console.log(`Server running on port ${app.app.get('port')}!`));
    });
}
main();
