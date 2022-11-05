import { v4 as generateID } from 'uuid'

export default class Chat {

    constructor(id){

        this.id = id || "B000-" + generateID()
        this.talkers = {}
        this.nicknames = []

    }

    isValidNickname(nickname){

        if(nickname === "") return false
        if(nickname === " ") return false
        if(typeof nickname !== "string") return false
        if(nickname.length < 3) return false
        if(this.nicknames.includes(nickname)) return false

        return true

    }

    add_talker(talker){

        if(talker.id in this.talkers) return {
            type: "error",
            body: "Ya estas en ese chat"
        }
        if(!this.isValidNickname(talker?.nickname)) return {
            type: "error",
            body: "Para unirte vas a tener que cambiar tu nickname"
        }

        this.talkers[talker.id] = talker
        this.nicknames.push(talker.nickname)

        talker.chat = this.id

        Object.values(this.talkers).forEach(socket => 
            socket.emit("message", {
                type: "success",
                body: `${talker.nickname} ha entrado al chat`
            }))

        return {
            type: "success",
            body: "Ya estas unido a un chat!"
        }

    }

    sendMessage(talker, body){

        Object.values(this.talkers).forEach(socket => 
            socket.emit("message", {
                type: "default",
                from: talker.nickname,
                body
            }))

    }

    remove_talker(talker){

        if(!(talker.id in this.talkers)) return true

        delete this.talkers[talker.id]

        delete this.nicknames[
            this.nicknames.indexOf(talker.nickname)
        ]

        talker.chat = null;

        Object.values(this.talkers).forEach(socket => 
            socket.emit("message", {
                type: "bot-online",
                body: `${talker.nickname} ha dejado el chat`
            }))

        return true

    }

}