export default class UserManager {

    users = {}

    get_user(id){
        return this.users[id];
    }

    link_nickname(id, nickname){
        const user_with_same_nick = Object.keys(this.users).find(key => this.users[key] === nickname);
        if(user_with_same_nick) return false; 
        this.users[id] = nickname.length > 0 ? nickname : id.slice(8);
        return true;
    }

    unlink_nickname(id){
        delete this.users[id];
    }

}