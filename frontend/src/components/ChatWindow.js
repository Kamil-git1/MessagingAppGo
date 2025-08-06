import React, { useEffect, useState } from 'react';
import '../styles/main.css';

const ChatWindow = ({ currentUser, chatPartner }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // Fetch messages from the backend when the component mounts
        const fetchMessages = async () => {
            const response = await fetch(`/api/messages/${currentUser.id}/${chatPartner.id}`);
            const data = await response.json();
            setMessages(data);
        };

        fetchMessages();
    }, [currentUser, chatPartner]);

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            const response = await fetch('/api/messages/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderId: currentUser.id,
                    receiverId: chatPartner.id,
                    content: newMessage,
                }),
            });

            if (response.ok) {
                const sentMessage = await response.json();
                setMessages((prevMessages) => [...prevMessages, sentMessage]);
                setNewMessage('');
            }
        }
    };

    return (
        <div className="chat-window">
            <div className="messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.senderId === currentUser.id ? 'sent' : 'received'}`}>
                        <p>{msg.content}</p>
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;