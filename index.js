import express from 'express';
import { Server as SocketServer } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import Chat from './Chat.js';

const getPath = () => dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(cors())
app.use(helmet())
app.use(express.urlencoded({
    extended: false
}))

//app.use(express.static(join(getPath(), "client/build")))

const server = createServer(app)

const io = new SocketServer(server, {
    cors: {
        origin: '*'
    }
})

const chats = {}

const global_chat = new Chat('GLOBAL');
chats[global_chat.id] = global_chat;

io.on("connection", (socket) => {

    socket.on("connect-chat", (id, nickname) => {

        socket.nickname = nickname.trim() == "" ? undefined : nickname.trim()

        if(id in chats){

            socket.emit("message", chats[id].add_talker(socket))

            return;

        }

        socket.emit("message", {
            type: "error",
            body: "Ese chat no existe"
        })

    })

    socket.on("message", (body) => {

        if(!socket?.chat) return socket.emit("message", {
            type: "error",
            body: "Debes unirte a un chat antes de enviar mensajes"
        })

        chats[socket.chat].sendMessage(socket, body)

    });

    socket.on("disconnect", () => {

        if(socket?.chat in chats) chats[socket.chat].remove_talker(socket)

    })

});

server.listen(process.env.PORT || 3000);