import express from 'express';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import UserManager from './UserManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({
    extended: false
}));

app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), '../client/build')));

// * Expandir y añadir una verificación al crear usuario
const manager = new UserManager();
manager.users = {};

io.on('connection', (socket) => {

    socket.broadcast.emit('message', {
        body: "Alguien ingreso al chat",
        frpm: "Bot Online"
    })

    socket.on('register', (nickname) => {
        const result = manager.link_nickname(socket.id, nickname);
        socket.emit('register_accepted', result);
    });

    socket.on('message', (message) => {
        const username = manager.get_user(socket.id);
        socket.broadcast.emit('message', {
            body: message, from: username
        });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('message', {
            body: `${manager.get_user(socket.id)} ha dejado el chat. Su nick esta disponible a partir de ahora.`,
            from: "Bot Online"
        });
        manager.unlink_nickname(socket.id);
    })

});

server.listen(process.env.PORT || 4000);

/* 
    TODO: Crear la aplicación cliente
*/
// ? Basado en https://github.com/FaztWeb/react-express-sockets