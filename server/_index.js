import express from 'express';
import { Server as SocketServer } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { v4 as generateID } from "uuid";

const app = express();
const server = createServer(app);
const io = new SocketServer(server);

const getPath = () => dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(getPath(), '../client/build')))
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({
    extended: false
}));

class Chat {

    talkers = {}
    nicknames = []

    constructor(){}

    add_talker(socket){
        if(!socket?.id) return false;
        if(!(socket.id in this.talkers)) return true;

        if(socket.nickname in this.nicknames) return false;

        this.talkers[socket.id] = socket;
        this.nicknames.push(socket.nickname);

        return true;
    }

}

const ChatGlobal = new Chat();
const private_chats = {};

const register = (nickname) => {}

io.on("connection", (socket) => {

    socket.id = generateID();

    socket.on("register", (nickname, callback) => {

        socket.nickname = nickname;

        const is_accepted = ChatGlobal.add_talker(socket);

        if(is_accepted){
            console.log("Aceptado");
        }else {
            console.log("Rechazado");
        }

        callback(is_accepted);

    });

});