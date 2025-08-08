import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ChatWindow from './components/ChatWindow';

function App() {
  const [currentUser, setCurrentUser] = useState(null); // 🧠 stan użytkownika
  
  return (
    <>
    
      <Navbar onLogin={setCurrentUser} />
      <ChatWindow currentUser={currentUser} />
    </>
  );
}

export default App;
