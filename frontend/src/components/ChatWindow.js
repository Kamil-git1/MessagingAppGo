import React, { useEffect, useState, useRef } from 'react';

const ChatWindow = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [receiverId, setReceiverId] = useState('');
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // Pobierz wiadomości publiczne
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

  // Pobierz użytkowników
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

  // Przewiń do ostatniej wiadomości
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Wyślij wiadomość
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!currentUser?.id) {
      console.warn('Brak danych użytkownika — nie można wysłać wiadomości');
      return;
    }

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
      } else {
        console.error('Błąd wysyłania wiadomości:', await response.text());
      }
    } catch (error) {
      console.error('Błąd połączenia z serwerem:', error);
    }
  };

  // 🗑️ Kasowanie wszystkich wiadomości
  const handleDeleteAllMessages = async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć wszystkie wiadomości?')) return;

    try {
      const response = await fetch('http://localhost:8080/api/messages/deleteAll', {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.status);
        setMessages([]); // wyczyść lokalnie
      } else {
        console.error('Błąd usuwania wiadomości:', await response.text());
      }
    } catch (error) {
      console.error('Błąd połączenia z serwerem:', error);
    }
  };

  // Stylizacja
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '1rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      height: '80vh',
    },
    messages: {
      flexGrow: 1,
      overflowY: 'auto',
      background: '#f9f9f9',
      padding: '0.5rem',
      borderRadius: '4px',
      border: '1px solid #ddd',
      marginBottom: '1rem',
    },
    message: {
      marginBottom: '0.5rem',
      padding: '0.3rem 0.5rem',
      borderRadius: '4px',
      backgroundColor: '#fff',
      wordBreak: 'break-word',
    },
    inputArea: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
    },
    input: {
      flex: 1,
      padding: '0.5rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#007bff',
      color: '#fff',
      cursor: 'pointer',
    },
    deleteButton: {
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#dc3545',
      color: '#fff',
      cursor: 'pointer',
      marginBottom: '1rem',
      alignSelf: 'flex-end',
    },
    loginNotice: {
      textAlign: 'center',
      padding: '2rem',
      fontStyle: 'italic',
      color: '#555',
    },
    checkbox: {
      marginLeft: '0.5rem',
    },
  };

  if (!currentUser?.id) {
    return <div style={styles.loginNotice}>🔒 Zaloguj się, aby korzystać z czatu</div>;
  }

  return (
    <div style={styles.container}>
      <h2>💬 Czat</h2>

      <button onClick={handleDeleteAllMessages} style={styles.deleteButton}>
        🗑️ Kasuj wszystkie wiadomości
      </button>

      <div style={styles.messages}>
        {messages.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#888' }}>Brak wiadomości</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={styles.message}>
              <strong>{msg.senderName || 'Użytkownik'}:</strong> {msg.content}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Napisz wiadomość..."
          style={styles.input}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
        />

        <label style={{ display: 'flex', alignItems: 'center' }}>
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

        <button onClick={handleSendMessage} style={styles.button}>
          Wyślij
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
