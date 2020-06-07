import { App } from "./app";
import http from "http";
import Game from "./game/Game";
const socketio = require("socket.io");
import {findUserById} from "./services/user.services"
import {BoardCell} from "./game/BoardCell";

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

        socket.on("only_join_game_room", (info: any) => {
            console.log("ONLY JOIN GAME ROOM");
            game = info.game;
            socket.join(`game_room_${info.userNotWaiting}_${info.userWaiting}`)
        });

        socket.on("join_game_room_then_send", async (users: any) => {
            const user1: any = await findUserById(users.userWaiting);
            const user2: any = await findUserById(users.userNotWaiting);
            game = new Game({...user1[0]}, {...user2[0]});

            console.log("JOIN GAME ROOM FOR ", users);
            socket.join(`game_room_${users.userNotWaiting}_${users.userWaiting}`);
            io.emit('sendToGameRoom', {
                userWaitingId: users.userWaiting,
                userNotWaitingId: users.userNotWaiting,
                room: `game_room_${users.userNotWaiting}_${users.userWaiting}`,
                game: game
            });
        });

        // ----------- GAME MESSAGES ------------------

        socket.on('send board with placed ships for player 1', (info: {room: string, board: Array<BoardCell>}) => {
            console.log("send board with placed ships for player 1: ");
            // game = {...game, player1: {...game.player1, positionedShips: true, turn: game.player2.positionedShips, board: info.board}};
            game.player1 = {...game.player1, positionedShips: true, turn: game.player2.positionedShips, board: info.board};
            io.to(info.room).emit("update game player 1", game.player1)
        });

        socket.on('send board with placed ships for player 2', (info: {room: string, board: Array<BoardCell>}) => {
            console.log("send board with placed ships for player 2: ");
            // game = {...game, player2: {...game.player2, turn: game.player1.positionedShips, positionedShips: true, board: info.board}};
            game.player2 = {...game.player2, positionedShips: true, turn: game.player1.positionedShips, board: info.board};
            io.to(info.room).emit("update game player 2", game.player2)
        });

        /**
         * Game update required for the client
         */
        socket.on("update game", (newGame: Game) => {
            game.player1 = {...newGame.player1};
            game.player1 = {...newGame.player2};
            // game.player1 = newGame.player1;
            // game.player2 = newGame.player2;
            console.log("UPDATE GAME")
        });

        /**
         * When client first enters the Game Page the game has to be sent to them
         */
        socket.on("receive game", (room: string) => {
            console.log("RECEIVE GAME: ", room);
            socket.to(room).emit("update game", game)
        });

        socket.on("shoot cell", (info: {room: string, cell: BoardCell}) => {
            game.makeShot(info.cell);
            io.to(info.room).emit("update game", game)
            // if(info.isPlayer1Shooting){
            //     console.log("SHOOT PLAYER 2: ", info.cell);
            //     // game.shootBoard2(info.cell);
            //     if(!game.player1.turn){
            //         console.log("NOT PLAYER 1 TURN");
            //         return;
            //     }
            //     let newBoard: BoardCell[] = game.player2.board;
            //     let index: number = game.player2.board.findIndex((cell) => cell.id === info.cell.id);
            //     newBoard[index] = {...newBoard[index], shot: true};
            //     game = {...game, player1: {...game.player1, turn: false}, player2: {...game.player2, turn: true, board: newBoard}};
            //     io.to(info.room).emit("update game", game);
            // } else {
            //     console.log("SHOOT PLAYER 1: ", info.cell);
            //     // game.shootBoard1(info.cell);
            //     if(!game.player2.turn){
            //         console.log("NOT PLAYER 2 TURN");
            //         return;
            //     }
            //     let newBoard: BoardCell[] = game.player1.board;
            //     let index: number = game.player1.board.findIndex((cell) => cell.id === info.cell.id);
            //     newBoard[index] = {...newBoard[index], shot: true};
            //     game = {...game, player2: {...game.player2, turn: false}, player1: {...game.player1, turn: true, board: newBoard}};
            //     io.to(info.room).emit("update game", game)
            // }
        });
    });

    await server.listen(app.app.get('port'), () => console.log(`Server running on port ${app.app.get('port')}!`))
}

main();
