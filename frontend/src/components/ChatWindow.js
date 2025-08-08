import React, { useEffect, useState, useRef } from 'react';

const ChatWindow = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [receiverId, setReceiverId] = useState('');
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/messages/public');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Błąd pobierania wiadomości:', error);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Błąd pobierania użytkowników:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!currentUser?.id) return;

    const payload = {
      senderId: currentUser.id,
      receiverId: isPrivate ? receiverId : null,
      content: newMessage,
      public: !isPrivate,
    };

    try {
      const response = await fetch('http://localhost:8080/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Błąd połączenia z serwerem:', error);
    }
  };

  const handleDeleteAllMessages = async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć wszystkie wiadomości?')) return;

    try {
      const response = await fetch('http://localhost:8080/api/messages/deleteAll', {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.status);
        setMessages([]);
      }
    } catch (error) {
      console.error('Błąd połączenia z serwerem:', error);
    }
  };

  const styles = {
 container: {
  position: 'absolute', // lub 'fixed' jeśli navbar jest sticky
  top: '60px', // wysokość Navbar
  left: 0,
  right: 0,
  bottom: 0,
  padding: '1rem 2rem',
  backgroundColor: '#1e1e2f',
  borderRadius: '0',
  boxShadow: 'none',
  color: '#f0f0f0',
  fontFamily: 'Segoe UI, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1, // niższy niż navbar
},
    messages: {
      flexGrow: 1,
      overflowY: 'auto',
      background: '#2a2a3d',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      scrollBehavior: 'smooth',
    },
    message: {
      marginBottom: '0.75rem',
      padding: '0.6rem 1rem',
      borderRadius: '8px',
      backgroundColor: '#3a3a4f',
      color: '#e0e0e0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    },
    inputArea: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      padding: '0.6rem 1rem',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#2f2f44',
      color: '#fff',
      fontSize: '1rem',
    },
    button: {
      padding: '0.6rem 1.2rem',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#4e8cff',
      color: '#fff',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background 0.3s',
    },
    buttonHover: {
      backgroundColor: '#3a6edc',
    },
    deleteButton: {
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#ff4d4d',
      color: '#fff',
      cursor: 'pointer',
      marginBottom: '1rem',
      alignSelf: 'flex-end',
      fontWeight: 'bold',
    },
    loginNotice: {
      textAlign: 'center',
      padding: '2rem',
      fontStyle: 'italic',
      color: '#aaa',
    },
    checkbox: {
      marginLeft: '0.5rem',
      accentColor: '#4e8cff',
    },
  };

  if (!currentUser?.id) {
    return <div style={styles.loginNotice}>🔒 Zaloguj się, aby korzystać z czatu</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: '1rem' }}>💬 Czat</h2>

      <button onClick={handleDeleteAllMessages} style={styles.deleteButton}>
        🗑️ Kasuj wszystkie wiadomości
      </button>

      <div style={styles.messages}>
        {messages.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#888' }}>Brak wiadomości</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={styles.message}>
              <strong style={{ color: '#4e8cff' }}>{msg.senderName || 'Użytkownik'}:</strong> {msg.content}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        style={styles.inputArea}
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Napisz wiadomość..."
          style={styles.input}
        />

        <label style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            style={styles.checkbox}
          />
          Prywatna
        </label>

        {isPrivate && (
          <select
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            style={styles.input}
          >
            <option value="">-- Wybierz odbiorcę --</option>
            {users
              .filter((u) => u.id !== currentUser.id)
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || `Użytkownik ${user.Username}`}
                </option>
              ))}
          </select>
        )}

        <button type="submit" style={styles.button}>
          ➤ Wyślij
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
