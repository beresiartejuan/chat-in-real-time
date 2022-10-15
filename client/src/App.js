import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react'

const socket = io("/");

const handlerNickName = (e) => {
    socket.emit('register', e.target.value);
}

const changeNickNameColor = (accepted) => {
    document.querySelector('input#nickname').style['background-color'] = accepted ? "green" : "red";

    if(accepted){
        document.getElementById('send').removeAttribute('disabled');
    }else{
        document.getElementById('send').setAttribute('disabled', '');
    }
}

function App() {

    const submitManager = (e) => {
        e.preventDefault();
        const message = document.getElementById('message');
        socket.emit('message', message.value);
        setMessages([...messages, {
            body: message.value,
            from: "Me"
        }])
        message.value = "";
    }

    const [messages, setMessages] = useState([{
        "body": "Bienvenidos, todos los mensajes que se envien no van a ser guardados en el servidor.",
        "from": "Bot Online"
    },{
        "body": "Para hablar deben colocarse un nick, si el recuadro esta en verde ya esta usando ese nick. Sí el recudadro esta en rojo el nick ya esta siendo usado, deberá elegir otro",
        "from": "Bot Online"
    },{
        "body": "En caso de no tener un nick, o usar un nick que ya este en uso, no podrá enviar mensages.",
        "from": "Bot Online"
    }]);

    useEffect(() => {

        const reciveMessage = (message) => {
            setMessages([
                ...messages,
                message
            ]);
        }

        socket.on('register_accepted', changeNickNameColor);
        socket.on('message', reciveMessage);

        window.onbeforeunload = function(e){
            socket.emit('disconnect');
        }

        return () => {
            socket.off('register_accepted', changeNickNameColor);
            socket.off('message', reciveMessage);
        }
    }, [messages]);

    return (
        <div className="flex items-center justify-center content-center">
            <form onSubmit={submitManager} className="bg-gray-800 p-2 w-fit h-screen relative max-w-3xl">
                <ul className="max-w-full overflow-hidden mb-4">
                    {
                        messages.map((message, index) => (
                            <li className={
                                `rounded-sm p-1 mb-1 ${message.from === 'Bot Online' ? "bg-blue-800" : "bg-neutral-700"}`
                                } key={index}>
                                <b className="text-slate-300">{message.from}:</b> {message.body}
                            </li>
                        ))
                    }
                </ul>
                <div className="absolute bottom-1 left-2 right-2">
                    <input
                        type="text"
                        className="mb-1 p-0.5 w-full text-center"
                        placeholder="Tu nombre"
                        onChange={handlerNickName}
                        id="nickname"
                    ></input>
                    <input type="text" className="mr-2 p-0.5 w-full mb-1" id="message"></input>
                    <input 
                        type="submit" 
                        className=" bg-green-500 rounded-sm px-2 py-0.5 cursor-pointer w-full"
                        id="send"
                        disabled></input>
                </div>

            </form>
        </div>
    );
}

export default App;
