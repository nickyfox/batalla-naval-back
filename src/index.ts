import {App} from "./app";
import http from "http";
import Game from "./game/Game";

const socketio = require("socket.io");
import {findUserById, saveMatchHistory} from "./services/user.services"
import {BoardCell} from "./game/BoardCell";
import {Ship} from "./game/Ship";

async function main() {
    const port = process.env.PORT || "8000";
    const app = new App(port);
    const server = http.createServer(app.app);

    const io = socketio.listen(server);

    io.on('connection', (socket: any) => {
        console.log("Socket connected " + socket.id);
        let game: Game;
        socket.on('message', (info: any) => {
            console.log("MESSAGE SENT");
            socket.to(info.room).emit('message', {
                body: info.message.body,
                from: info.message.from
            })
        });

        socket.on("only_join_game_room", (info: { game: Game, userNotWaiting: string, userWaiting: string }) => {
            console.log("ONLY JOIN GAME ROOM");
            game = info.game;
            socket.join(`game_room_${info.userNotWaiting}_${info.userWaiting}`)
        });

        socket.on("join_game_room_then_send", async (users: any) => {
            const user1: any = await findUserById(users.userWaiting);
            const user2: any = await findUserById(users.userNotWaiting);
            game = new Game({...user1[0]}, {...user2[0]}, new Date().getTime());

            console.log("JOIN GAME ROOM FOR ", users);
            socket.join(`game_room_${users.userNotWaiting}_${users.userWaiting}`);
            io.emit('sendToGameRoom', {
                userWaitingId: users.userWaiting,
                userNotWaitingId: users.userNotWaiting,
                room: `game_room_${users.userNotWaiting}_${users.userWaiting}`,
                game: game
            });
        });

        socket.on("leave room", (info: { room: string }) => {
            console.log("LEFT ROOM");
            socket.leave(info.room);
        });

        // ----------- GAME MESSAGES ------------------

        socket.on('send board with placed ships for player 1', (info: { room: string, board: Array<BoardCell>, ships: Ship[] }) => {
            console.log("send board with placed ships for player 1: ");
            // if(info.board.filter(cells => cells.occupied).length === 0) {
            //     socket.emit("no positioned ships");
            //     return;
            // }
            // if(info.ships.length !== 0){
            //     socket.emit("not positioned all ships");
            //     return;
            // }

            game = {
                ...game,
                player1: {...game.player1, positionedShips: true, turn: game.player2.positionedShips, board: info.board}
            };
            io.to(info.room).emit("update game player 1", game.player1)
            if (game.player2.positionedShips) timer(info.room, !game.player2.positionedShips, false)
        });

        socket.on('send board with placed ships for player 2', (info: { room: string, board: Array<BoardCell>, ships: Ship[] }) => {
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

            game = {
                ...game,
                player2: {...game.player2, turn: game.player1.positionedShips, positionedShips: true, board: info.board}
            };
            io.to(info.room).emit("update game player 2", game.player2)
            if (game.player1.positionedShips) timer(info.room, !game.player1.positionedShips, false)
        });

        /**
         * Game update required for the client
         */
        socket.on("update game", (newGame: Game) => {
            game = {...newGame};
            console.log("UPDATE GAME")
        });

        /**
         * When client first enters the Game Page the game has to be sent to them
         */
        socket.on("receive game", (room: string) => {
            console.log("RECEIVE GAME: ", room);
            socket.to(room).emit("update game", game)
        });

        socket.on("shoot cell", (info: { room: string, cell: BoardCell, isPlayer1Shooting: boolean }) => {
            if (info.isPlayer1Shooting) {
                console.log("SHOOT PLAYER 2: ", info.cell);
                if (!game.player1.turn) {
                    console.log("NOT PLAYER 1 TURN");
                    socket.emit("not your turn");
                    return;
                }
                let newBoard: BoardCell[] = game.player2.board;
                let index: number = game.player2.board.findIndex((cell) => cell.id === info.cell.id);
                if (newBoard[index].shot) {
                    socket.emit("already shot cell");
                    return;
                }
                newBoard[index] = {...newBoard[index], shot: true};
                game = {
                    ...game,
                    player1: {...game.player1, turn: false},
                    player2: {...game.player2, turn: true, board: newBoard}
                };

                if (game.player2.board.filter(cell => cell.occupied).filter(occupiedCells => !occupiedCells.shot).length === 0) {
                    console.log("PLAYER 1 WON");
                    saveMatchHistory({winner_id: game.player1.user.id}, {loser_id: game.player2.user.id}, game.initialTime).then(() => {
                        io.to(info.room).emit("player 1 won", {winner: game.player1, loser: game.player2});
                    });
                }
                io.to(info.room).emit("update game", game);
                timer(info.room, false, false)
            } else {
                console.log("SHOOT PLAYER 1: ", info.cell);
                if (!game.player2.turn) {
                    console.log("NOT PLAYER 2 TURN");
                    socket.emit("not your turn");
                    return;
                }
                let newBoard: BoardCell[] = game.player1.board;
                let index: number = game.player1.board.findIndex((cell) => cell.id === info.cell.id);
                if (newBoard[index].shot) {
                    socket.emit("already shot cell");
                    return;
                }
                newBoard[index] = {...newBoard[index], shot: true};
                game = {
                    ...game,
                    player2: {...game.player2, turn: false},
                    player1: {...game.player1, turn: true, board: newBoard}
                };
                if (game.player1.board.filter(cell => cell.occupied).filter(occupiedCells => !occupiedCells.shot).length === 0) {
                    console.log("PLAYER 2 WON");
                    timer(info.room, false, true)
                    saveMatchHistory({winner_id: game.player2.user.id}, {loser_id: game.player1.user.id}, game.initialTime).then(() => {
                        io.to(info.room).emit("player 2 won", {winner: game.player2, loser: game.player1});
                    });
                }
                io.to(info.room).emit("update game", game)
                timer(info.room, true, false)
            }
        });

        socket.on("shoot random cell", (info: { room: string, isPlayer1Shooting: boolean }) => {
            shootRandomCell(info.room, info.isPlayer1Shooting)
        });

        socket.on("turn time finished", (info: { room: string, isPlayer1: boolean }) => {
            shootRandomCell(info.room, info.isPlayer1);
        });

        socket.on("player wants rematch", (info: { room: string, isPlayer1: boolean }) => {
            if (info.isPlayer1) {
                io.to(info.room).emit("player 1 wants rematch")
            } else {
                io.to(info.room).emit("player 2 wants rematch")
            }
        });

        socket.on("rematch", (info: { room: string }) => {
            game = new Game(game.player1.user, game.player2.user, new Date().getTime());
            io.to(info.room).emit("restart game", game);
        });

        socket.on("quit game", (info: { room: string, isPlayer1: boolean }) => {
            if (info.isPlayer1) {
                timer(info.room, info.isPlayer1, true)
                socket.leave(info.room);
                saveMatchHistory({winner_id: game.player2.user.id}, {loser_id: game.player1.user.id}, game.initialTime).then(() => {
                    io.to(info.room).emit("player 2 won", {winner: game.player2, loser: game.player1});
                });
            } else {
                timer(info.room, info.isPlayer1, true)
                socket.leave(info.room);
                saveMatchHistory({winner_id: game.player1.user.id}, {loser_id: game.player2.user.id}, game.initialTime).then(() => {
                    io.to(info.room).emit("player 1 won", {winner: game.player1, loser: game.player2});
                });
            }
        });

        var interval: number;

        function timer(room: string, isPlayer1: boolean, justClearInterval: boolean) {
            if (!justClearInterval) {
                if (typeof interval !== 'undefined') clearInterval(interval)
                let countdown = 15;
                interval = setInterval(function (func: number) {
                    console.log("interval for player1: ", isPlayer1)
                    console.log(countdown)
                    countdown--;
                    io.to(room).emit('currentTime', {currentTime: countdown});
                    if (countdown == 0) {
                        clearInterval(interval);
                        shootRandomCell(room, isPlayer1);
                    }
                }, 1000);
            } else {
                clearInterval(interval)
            }
        }


        function shootRandomCell(room: string, isPlayer1: boolean) {
            console.log("RANDOM SHOOT");
            if (isPlayer1) {
                if (!game.player1.turn) {
                    console.log("NOT PLAYER 1 TURN");
                    socket.emit("not your turn");
                    return;
                }
                let newBoard: BoardCell[] = game.player2.board;
                let filteredBoard: BoardCell[] = game.player2.board.filter((cell: BoardCell) => !cell.shot);

                const randomIndex = Math.floor(Math.random() * (filteredBoard.length));

                const shotCell: BoardCell = filteredBoard[randomIndex];

                const index = newBoard.findIndex(cell => cell.id === shotCell.id);

                newBoard[index] = {...shotCell, shot: true};
                game = {
                    ...game,
                    player1: {...game.player1, turn: false},
                    player2: {...game.player2, turn: true, board: newBoard}
                };

                if (game.player2.board.filter(cell => cell.occupied).filter(occupiedCells => !occupiedCells.shot).length === 0) {
                    console.log("PLAYER 1 WON");
                    saveMatchHistory({winner_id: game.player1.user.id}, {loser_id: game.player2.user.id}, game.initialTime).then(() => {
                        io.to(room).emit("player 1 won", {winner: game.player1, loser: game.player2});
                    });
                }
                io.to(room).emit("update game", game);
                timer(room, false, false)
            } else {
                if (!game.player2.turn) {
                    console.log("NOT PLAYER 2 TURN");
                    socket.emit("not your turn");
                    return;
                }
                let newBoard: BoardCell[] = game.player1.board;

                let filteredBoard: BoardCell[] = game.player1.board.filter((cell: BoardCell) => !cell.shot);

                const randomIndex = Math.floor(Math.random() * (filteredBoard.length));
                const shotCell: BoardCell = filteredBoard[randomIndex];
                const index = newBoard.findIndex(cell => cell.id === shotCell.id);
                newBoard[index] = {...shotCell, shot: true};

                game = {
                    ...game,
                    player2: {...game.player2, turn: false},
                    player1: {...game.player1, turn: true, board: newBoard}
                };

                if (game.player1.board.filter(cell => cell.occupied).filter(occupiedCells => !occupiedCells.shot).length === 0) {
                    console.log("PLAYER 2 WON");
                    saveMatchHistory({winner_id: game.player2.user.id}, {loser_id: game.player1.user.id}, game.initialTime).then(() => {
                        io.to(room).emit("player 2 won", {winner: game.player2, loser: game.player1});
                    });
                }
                io.to(room).emit("update game", game)
                timer(room, true, false)
            }
        }
    });

    await server.listen(app.app.get('port'), () => console.log(`Server running on port ${app.app.get('port')}!`))
}


main();
