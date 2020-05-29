import { App } from "./app";
import http from "http";
const socketio = require("socket.io");

async function main() {
    const port = process.env.PORT || "8000";
    const app = new App(port);
    const server = http.createServer(app.app);

    const io = socketio.listen(server);

    io.on('connection', (socket: any) => {
        console.log("Socket connected " + socket.id);
        socket.on('message', (info: any) => {
            console.log("MESSAGE SENT");
            socket.to(info.room).emit('message', {
                body: info.message.body,
                from: info.message.from
            })
        });

        socket.on("only_join_game_room", (users: any) => {
            console.log("ONLY JOIN GAME ROOM");
            socket.join(`game_room_${users.userNotWaiting}_${users.userWaiting}`)
        });

        socket.on("join_game_room_then_send", (users: any) => {
            console.log("JOIN GAME ROOM FOR ", users);
            socket.join(`game_room_${users.userNotWaiting}_${users.userWaiting}`);
            io.emit('sendToGameRoom', {userWaitingId: users.userWaiting, userNotWaitingId: users.userNotWaiting, room: `game_room_${users.userNotWaiting}_${users.userWaiting}`});
        });
    });
    await server.listen(app.app.get('port'), () => console.log(`Server running on port ${app.app.get('port')}!`))
}

main();
