import { App } from "./app";
import http from "http";
import Game from "./game/Game";
const socketio = require("socket.io");
import {findUserById} from "./services/user.services"

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

        /**
         * First we check if player1 or player2 should be updated
         * -> we change what is required for the game
         * -> we update the game and emit an event so the info is updated in the client
         */
        socket.on('change user positioned ships', (info: {room: string, user_id: string}) => {
            console.log("change user positioned ships: ", info.room);
            console.log("for user: ", info.user_id);
            if(game.player1.user.id === info.user_id){
                console.log("change player 1 positioned ships");
                game = {...game, player1: {...game.player1, positionedShips: true}};
                console.log("New game state: ", game);
                io.to(info.room).emit("update game", game)
            } else {
                console.log("change player 2 positioned ships");
                game = {...game, player2: {...game.player2, positionedShips: true}};
                console.log("New game state: ", game);
                io.to(info.room).emit("update game", game)
            }
        });

        /**
         * Game update required for the client
         */
        socket.on("update game", (newGame: Game) => {
            game = {...newGame};
            console.log("UPDATE GAME: ", newGame)
        });

        /**
         * When client first enters the Game Page the game has to be sent to them
         */
        socket.on("receive game", (room: string) => {
            console.log("RECEIVE GAME: ", room);
            socket.to(room).emit("update game", game)
        });
    });
    await server.listen(app.app.get('port'), () => console.log(`Server running on port ${app.app.get('port')}!`))
}

main();
