import React, { useState } from 'react';

// Komponent Navbar przyjmuje funkcję onLogin jako props — służy do przekazania zalogowanego użytkownika do App.js
const Navbar = ({ onLogin }) => {
  // Stan rozwijanego menu
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Stan aktywnego formularza ('register' lub 'login')
  const [activeForm, setActiveForm] = useState(null);

  // Lokalny stan zalogowanego użytkownika (do wyświetlenia w pasku)
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Dane z formularza rejestracji/logowania
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  });

  // Przełączanie widoczności rozwijanego menu
  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  // Pokazuje wybrany formularz i resetuje dane wejściowe
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

  // Obsługa zmian w polach formularza
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Obsługa rejestracji użytkownika
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

  // Obsługa logowania użytkownika
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
        setLoggedInUser(result);   // zapis lokalny
        onLogin(result);           // przekazanie użytkownika do App.js
        setActiveForm(null);
      } else {
        alert(`Błąd logowania: ${result.error || 'Nieznany błąd'}`);
      }
    } catch (error) {
      alert('Błąd połączenia z serwerem');
      console.error(error);
    }
  };

  // Obsługa wylogowania
  const handleLogout = () => {
    setLoggedInUser(null); // czyścimy lokalny stan
    onLogin(null);         // czyścimy w App.js
    alert('Wylogowano');
  };

  // Stylizacja komponentu
  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#2c3e50',
      padding: '10px 20px',
      color: 'white',
    },
    searchInput: {
      padding: '5px',
      borderRadius: '4px',
      border: 'none',
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
      backgroundColor: '#f1f1f1',
      minWidth: '160px',
      boxShadow: '0px 8px 16px rgba(0,0,0,0.2)',
      zIndex: 1,
    },
    dropdownButton: {
      width: '100%',
      padding: '10px',
      border: 'none',
      background: 'none',
      textAlign: 'left',
      cursor: 'pointer',
    },
    formContainer: {
      padding: '20px',
      backgroundColor: '#ecf0f1',
      margin: '20px',
      borderRadius: '8px',
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

  // Render komponentu
  return (
    <div>
      <div style={styles.navbar}>
        <div>
          {/* <input type="text" placeholder="Szukaj..." style={styles.searchInput} /> */}
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

      {/* Formularz rejestracji */}
      {activeForm === 'register' && (
        <div style={styles.formContainer}>
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
          <button style={styles.formButton} onClick={handleRegister}>Zarejestruj się</button>
        </div>
      )}

      {/* Formularz logowania */}
      {activeForm === 'login' && (
        <div style={styles.formContainer}>
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
          <button style={styles.formButton} onClick={handleLogin}>Zaloguj się</button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
