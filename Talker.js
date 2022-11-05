import { v4 as generateID } from "uuid";

export default class Talker {

    static getTalker(socket){

        socket.id = generateID();
        socket.papa = generateID();

        return socket;

    }

}