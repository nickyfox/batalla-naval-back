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
            game = new Game(user1, user2);

            console.log("JOIN GAME ROOM FOR ", users);
            socket.join(`game_room_${users.userNotWaiting}_${users.userWaiting}`);
            io.emit('sendToGameRoom', {
                userWaitingId: users.userWaiting,
                userNotWaitingId: users.userNotWaiting,
                room: `game_room_${users.userNotWaiting}_${users.userWaiting}`,
                game: game
            });
        });
    });
    await server.listen(app.app.get('port'), () => console.log(`Server running on port ${app.app.get('port')}!`))
}

main();
