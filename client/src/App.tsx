import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:4000");

interface Message {
    id: number;
    text: string;
    user: string;
}

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");
    const [user, setUser] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.on("message", (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off("message");
        };
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = () => {
        if (message.trim() && user.trim()) {
            const newMessage = { id: Date.now(), text: message, user };
            socket.emit("message", newMessage);
            setMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className='flex items-center justify-center h-screen bg-gray-100'>
            <div className='flex flex-col w-full max-w-md bg-white rounded-lg shadow-lg p-4'>
                <header className='text-center text-xl font-bold mb-4 border-b pb-2'>
                    Chat Room
                </header>
                <div className='mb-4'>
                    <input
                        type='text'
                        className='border rounded p-2 w-full'
                        placeholder='Enter your name...'
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                    />
                </div>
                <div className='flex-grow max-h-[60vh] overflow-y-auto mb-4'>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-2 rounded-lg mb-2 w-fit max-w-xs ${
                                msg.user === user
                                    ? "bg-blue-500 text-white self-end"
                                    : "bg-gray-200 text-black self-start"
                            }`}>
                            <strong>{msg.user}:</strong> {msg.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef}></div>
                </div>
                <div className='flex'>
                    <input
                        type='text'
                        className='border rounded-l-lg p-2 flex-grow'
                        placeholder='Type a message...'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        className='bg-blue-500 text-white rounded-r-lg p-2'
                        onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
