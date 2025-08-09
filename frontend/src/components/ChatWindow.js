import React, { useEffect, useState, useRef } from 'react';

const ChatWindow = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState('public');
  const [openChats, setOpenChats] = useState(['public']);
  const [showUserList, setShowUserList] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const messagesEndRef = useRef(null);

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
const fetchMessages = async () => {
  if (!currentUser?.id) return;

  try {
    let response;
    let data;

    if (activeChat === 'public') {
      response = await fetch('http://localhost:8080/api/messages/public');
    } else {
      const receiverId = getReceiverId();
      if (!receiverId) return;

      response = await fetch(`http://localhost:8080/api/messages/${currentUser.id}/${receiverId}`);
     

    }

    if (!response.ok) {
      const errorText = await response.text(); // odczytaj jako tekst, jeśli nie JSON
      throw new Error(`Błąd serwera (${response.status}): ${errorText}`);
    }

    data = await response.json();

    if (activeChat === 'public') {
      setMessages(data);
    } else {
      setPrivateMessages((prev) => ({ ...prev, [activeChat]: data }));
    }
  } catch (error) {
    console.error('Nie udało się pobrać wiadomości:', error.message);
  }
};



    fetchMessages();
  }, [activeChat, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, privateMessages, activeChat]);

const getReceiverId = () => {
  if (activeChat === 'public') return null;
  const user = users.find((u) => u.Username === activeChat);
  return user?.ID || null;
};

const handleSendMessage = async () => {
  if (!newMessage.trim() || !currentUser?.id) return;

  const receiverId = getReceiverId();

  const payload = {
    senderId: currentUser.id,
    receiverId: receiverId,
    content: newMessage,
    public: activeChat === 'public',
  };

  try {
    const response = await fetch('http://localhost:8080/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const sentMessage = await response.json();
      if (activeChat === 'public') {
        setMessages(prev => [...prev, sentMessage]);
      } else {
        setPrivateMessages(prev => ({
          ...prev,
          [activeChat]: [...(prev[activeChat] || []), sentMessage],
        }));
      }
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
        setPrivateMessages({});
      }
    } catch (error) {
      console.error('Błąd połączenia z serwerem:', error);
    }
  };
useEffect(() => {
  if (!currentUser) {
    setOpenChats(['public']);
    setActiveChat('public');
    setPrivateMessages({});
    setMessages([]);
  }
}, [currentUser]);

  const openNewChat = (userId) => {
    const id = String(userId);
    if (!openChats.includes(id)) {
      setOpenChats(prev => [...prev, id]);
    }
    setActiveChat(id);
    setShowUserList(false);
  };

  const styles = {
    container: {
      position: 'absolute',
      top: '60px',
      left: 0,
      right: 0,
      bottom: 0,
      padding: '1rem 2rem',
      backgroundColor: '#1e1e2f',
      color: '#f0f0f0',
      fontFamily: 'Segoe UI, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1,
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
    tabBar: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '1rem',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    tabButton: (active) => ({
      backgroundColor: active ? '#4e8cff' : '#2f2f44',
      color: '#fff',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      cursor: 'pointer',
    }),
    userList: {
      backgroundColor: '#2a2a3d',
      padding: '0.5rem',
      borderRadius: '8px',
      marginBottom: '1rem',
    },
    userItem: {
      padding: '0.4rem 0.8rem',
      cursor: 'pointer',
      color: '#fff',
    },
    contextMenu: {
      position: 'absolute',
      backgroundColor: '#2a2a3d',
      color: '#fff',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      zIndex: 10,
      cursor: 'pointer',
    },
  };

  if (!currentUser?.id) {
    return <div style={styles.loginNotice}>🔒 Zaloguj się, aby korzystać z czatu</div>;
  }

  return (
    <div style={styles.container} onClick={() => setContextMenu(null)}>
      <h2 style={{ marginBottom: '1rem' }}>💬 Czat</h2>

      <button onClick={handleDeleteAllMessages} style={styles.deleteButton}>
        🗑️ Kasuj wszystkie wiadomości
      </button>

      <div style={styles.tabBar}>
        {openChats.map((chatId) => {
          
          const user = users.find((u) => String(u.id) === String(chatId));
          const label = chatId === 'public'
            ? '🌐 Publiczny'
            : `💬 ${user?.name || user?.username || `Użytkownik ${chatId}`}`;

          return (
            <button
              key={chatId}
              onClick={() => setActiveChat(chatId)}
              onContextMenu={(e) => {
                e.preventDefault();
                if (chatId !== 'public') {
                  setContextMenu({ x: e.pageX, y: e.pageY, chatId });
                }
              }}
              style={styles.tabButton(activeChat === chatId)}
            >
              {label}
            </button>
          );
        })}
        <button onClick={() => setShowUserList((prev) => !prev)} style={styles.button}>
          ➕ Nowa rozmowa
        </button>
      </div>

      {showUserList && (
        <div style={styles.userList}>
          {users.length === 0 ? (
  <div style={{ color: '#aaa', fontStyle: 'italic' }}>⏳ Ładowanie użytkowników...</div>
) : (
  users
    .filter((u) => u.Username !== currentUser.Username && !openChats.includes(u.Username))
    .map((user) => (
      <div
        key={user.ID}
        style={styles.userItem}
        onClick={() => openNewChat(user.Username)}
      >
        👤 {user.Name || user.Username || `Użytkownik ${user.ID}`}
      </div>
    ))
)}

        </div>
      )}

      <div style={styles.messages}>
        {(activeChat === 'public' ? messages : privateMessages[activeChat] || []).map((msg) => (
          <div key={msg.id} style={styles.message}>
            <strong style={{ color: '#4e8cff' }}>{msg.senderName || 'Użytkownik'}:</strong> {msg.content}
          </div>
        ))}
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
        <button type="submit" style={styles.button}>
          ➤ Wyślij
        </button>
      </form>

      {contextMenu && (
        <div
          style={{
            ...styles.contextMenu,
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          onClick={() => {
            setOpenChats((prev) => prev.filter((id) => id !== contextMenu.chatId));
            if (activeChat === contextMenu.chatId) {
              setActiveChat('public');
            }
            setContextMenu(null);
          }}
          onMouseLeave={() => setContextMenu(null)}
        >
          ❌ Zamknij okno
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
