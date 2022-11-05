import { useEffect } from 'react';
import { useState } from 'react'
import { AiOutlineMenu } from "react-icons/ai"
import { io } from "socket.io-client"

const socket = io("/")

function App() {

    const showMenu = () => {
        document.querySelector("div#menu").classList.toggle("hidden")
    }

    const connect_chat = () => {

        const nickname = document.querySelector("input[name='nickname']")
        const chat_id = document.querySelector("input[name='chat-id']")

        socket.emit("connect-chat", chat_id.value, nickname.value);

    }

    const send_message = () => {

        const message = document.querySelector("input[name='message']")

        socket.emit("message", message.value)

    }

    const [messages, setMessages] = useState([
        {
            from: "BotOnline",
            type: "bot-online",
            body: "¡Hola! Para poder entrar en un chat debes hacer tres cosas:"
        },
        {
            from: "BotOnline",
            type: "bot-online",
            body: "1) Abrir el menu inferior y colocarte un nickname"
        },
        {
            from: "BotOnline",
            type: "bot-online",
            body: "2) Para ingresar a un chat tienes que tener un codigo, por defecto esta el codigo del chat publico( \"B000-GLOBAL\" ) y apretar el boton \"Unirme\""
        },
    ])

    useEffect(() => {
        const on_message = (message) => {
            setMessages([...messages, message])
        }

        socket.on("message", on_message)

        window.onbeforeunload = function(e){
            socket.emit('disconnect');
        }

        return () => {
            socket.off("message", on_message)
        }
    }, [socket, messages])

    const styles_message = {
        'default': "p-1 mb-2 border-transparent bg-white rounded-md",
        'error': "py-1 px-3 bg-red-700 mb-2 border-transparent bg-white rounded-md font-bold",
        'success': "py-1 px-3 bg-green-700 mb-2 border-transparent bg-white rounded-md font-bold",
        'bot-online': "p-1 mb-2 bg-sky-700 border-transparent bg-white rounded-md"
    }

    return (
        <div className="h-screen w-screen p-2 overflow-x-hidden">
            <div className="">
                {messages.map((message, index) => (<p key={index} className={ message?.type in styles_message ? styles_message[message.type] : styles_message["default"] }>
                    <strong>{ message?.from ? `${ message.from }: ` : `` }</strong> { message.body }
                </p>))}
            </div>
            <div className="fixed bottom-0 left-0 right-0 bg-gray-200">
                <div className="flex justify-between p-1 my-2">
                    <input className="p-2 rounded-lg mr-2 w-full" placeholder="" name="message"></input>
                    <button className="py-2 px-3 rounded-lg bg-blue-700" onClick={send_message}>Enviar</button>
                </div>
                <div className="hidden" id="menu">
                    <div className="flex my-2 p-1">
                        <input className="w-full p-2 rounded-lg mr-2" name="nickname" placeholder="Tu nickname..."></input>
                    </div>
                    <div className="flex justify-between p-1 my-2">
                        <input className="p-2 rounded-lg mr-2 w-full" name="chat-id" placeholder="B000-GLOBAL" defaultValue={"B000-GLOBAL"}></input>
                        <button className="py-2 px-3 rounded-lg bg-green-700" onClick={connect_chat}>Unirme</button>
                    </div>
                </div>
                <div className="flex text-center justify-center p-2 bg-blue-700">
                    <button onClick={showMenu}><AiOutlineMenu className="text-2xl"></AiOutlineMenu></button>
                </div>
            </div>
        </div>
    )
}

export default App
