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
        socket.on('message', (message: any) => {
            socket.broadcast.emit('message', {
                body: message.body,
                from: message.from
            })
        });
    });
    await server.listen(app.app.get('port'), () => console.log(`Server running on port ${app.app.get('port')}!`))
}

main();
