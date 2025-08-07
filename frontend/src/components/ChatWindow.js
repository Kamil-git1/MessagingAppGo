import React, { useEffect, useState } from 'react';
import '../styles/main.css';

const ChatWindow = ({ currentUser }) => {
  const [chatPartnerId, setChatPartnerId] = useState('public'); // domyślnie czat publiczny
  const [chatPartner, setChatPartner] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Pobierz listę użytkowników
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users');
      const data = await response.json();
      const filtered = data.filter(user => user.id !== currentUser.id);
      setUsers(filtered);
    };
    fetchUsers();
  }, [currentUser]);

  // Pobierz wiadomości (publiczne lub prywatne)
  useEffect(() => {
    const fetchMessages = async () => {
      let url = '';

      if (chatPartnerId === 'public') {
        url = `/api/messages/public`;
        setChatPartner(null);
      } else {
        url = `/api/messages/${currentUser.id}/${chatPartnerId}`;
        const selectedUser = users.find(u => u.id === chatPartnerId);
        setChatPartner(selectedUser);
      }

      const response = await fetch(url);
      const data = await response.json();
      setMessages(data);
    };

    fetchMessages();
  }, [chatPartnerId, users, currentUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const payload =
      chatPartnerId === 'public'
        ? {
            senderId: currentUser.id,
            content: newMessage,
            public: true,
          }
        : {
            senderId: currentUser.id,
            receiverId: chatPartnerId,
            content: newMessage,
          };

    const response = await fetch('/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const sentMessage = await response.json();
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
    }
  };

  const handlePartnerChange = (e) => {
    setChatPartnerId(e.target.value);
  };

  return (
    <div className="chat-window">
      <h2>Wiadomości</h2>

      <div className="user-select">
        <label>Wybierz czat:</label>
        <select value={chatPartnerId} onChange={handlePartnerChange}>
          <option value="public">🌐 Czat publiczny</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      <h3>
        {chatPartnerId === 'public'
          ? 'Czat publiczny'
          : `Czat z: ${chatPartner?.username || ''}`}
      </h3>

      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.senderId === currentUser.id ? 'sent' : 'received'}`}
          >
            <p><strong>{msg.senderName || 'Użytkownik'}:</strong> {msg.content}</p>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Napisz wiadomość..."
        />
        <button onClick={handleSendMessage}>Wyślij</button>
      </div>
    </div>
  );
};

export default ChatWindow;
