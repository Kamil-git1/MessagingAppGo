import React, { useState, useEffect } from 'react';

const Navbar = ({ onLogin }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  });

  // 🔁 Przy starcie aplikacji — sprawdź czy użytkownik jest zapisany
  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setLoggedInUser(parsedUser);
      onLogin(parsedUser);
    }
  }, [onLogin]);

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const showForm = (formType) => {
    setActiveForm(formType);
    setDropdownOpen(false);
    setFormData({
      username: '',
      email: '',
      password: '',
      repeatPassword: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    if (formData.password !== formData.repeatPassword) {
      alert('Hasła nie są zgodne!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Rejestracja zakończona sukcesem!');
        setActiveForm(null);
      } else {
        alert(`Błąd rejestracji: ${result.error || 'Nieznany błąd'}`);
      }
    } catch (error) {
      alert('Błąd połączenia z serwerem');
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: formData.username,
          password: formData.password,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Zalogowano jako: ${result.username}`);
        setLoggedInUser(result);
        onLogin(result);
        localStorage.setItem('loggedInUser', JSON.stringify(result)); // 💾 zapisz użytkownika
        setActiveForm(null);
      } else {
        alert(`Błąd logowania: ${result.error || 'Nieznany błąd'}`);
      }
    } catch (error) {
      alert('Błąd połączenia z serwerem');
      console.error(error);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    onLogin(null);
    localStorage.removeItem('loggedInUser'); // 🧹 usuń z localStorage
    alert('Wylogowano');
  };

  const styles = {
navbar: {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '60px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#1e1e2f',
  padding: '0 20px',
  color: 'white',
  zIndex: 1000,
  boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
},
    userInfo: {
      marginLeft: '1rem',
      fontStyle: 'italic',
      color: '#ecf0f1',
    },
    menuButton: {
      backgroundColor: '#3498db',
      border: 'none',
      padding: '8px 12px',
      color: 'white',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    dropdown: {
      position: 'relative',
    },
    dropdownContent: {
      position: 'absolute',
      right: 0,
      backgroundColor: '#1e1e2f',
      minWidth: '160px',
      boxShadow: '0px 8px 16px rgba(0,0,0,0.2)',
      zIndex: 1,
    },
    dropdownButton: {
      width: '100%',
      padding: '10px',
      border: 'none',
      color: '#ffff',
      background: 'none',
      textAlign: 'left',
      cursor: 'pointer',
    },
formContainer: {
  padding: '20px',
  backgroundColor: '#ecf0f1',
  margin: '80px auto 20px auto', // odstęp od navbar
  borderRadius: '8px',
  maxWidth: '400px',
  zIndex: 1001,
  position: 'relative',
},
    formInput: {
      display: 'block',
      margin: '10px 0',
      padding: '8px',
      width: '100%',
      maxWidth: '300px',
    },
    formButton: {
      padding: '8px 12px',
      backgroundColor: '#2ecc71',
      border: 'none',
      color: 'white',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  return (
    <div>
      <div style={styles.navbar}>
        <div>
          {loggedInUser && (
            <span style={styles.userInfo}>Zalogowano jako: {loggedInUser.username}</span>
          )}
        </div>
        <div style={styles.dropdown}>
          <button style={styles.menuButton} onClick={toggleDropdown}>Opcje</button>
          {dropdownOpen && (
            <div style={styles.dropdownContent}>
              <button style={styles.dropdownButton} onClick={() => showForm('register')}>Rejestracja</button>
              {!loggedInUser ? (
                <button style={styles.dropdownButton} onClick={() => showForm('login')}>Logowanie</button>
              ) : (
                <button style={styles.dropdownButton} onClick={handleLogout}>Wyloguj</button>
              )}
            </div>
          )}
        </div>
      </div>

      {activeForm === 'register' && (
        <form
          style={styles.formContainer}
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <h3>Formularz rejestracji</h3>
          <input
            type="text"
            name="username"
            placeholder="Nazwa użytkownika"
            value={formData.username}
            onChange={handleChange}
            style={styles.formInput}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.formInput}
          />
          <input
            type="password"
            name="password"
            placeholder="Hasło"
            value={formData.password}
            onChange={handleChange}
            style={styles.formInput}
          />
          <input
            type="password"
            name="repeatPassword"
            placeholder="Powtórz hasło"
            value={formData.repeatPassword}
            onChange={handleChange}
            style={styles.formInput}
          />
          <button type="submit" style={styles.formButton}>Zarejestruj się</button>
        </form>
      )}

      {activeForm === 'login' && (
        <form
          style={styles.formContainer}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <h3>Formularz logowania</h3>
          <input
            type="text"
            name="username"
            placeholder="Nazwa użytkownika"
            value={formData.username}
            onChange={handleChange}
            style={styles.formInput}
          />
          <input
            type="password"
            name="password"
            placeholder="Hasło"
            value={formData.password}
            onChange={handleChange}
            style={styles.formInput}
          />
          <button type="submit" style={styles.formButton}>Zaloguj się</button>
        </form>
      )}
    </div>
  );
};

export default Navbar;
