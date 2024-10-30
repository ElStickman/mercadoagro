//React must import.
import React, { useState, useEffect, useCallback } from 'react';
//Browser stuff for routing and navigation
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
//archivos locales.
import Header from './Header';
import Footer from './Footer';
import About from './About';
import Register from './Register';
import Login from './Login';
import Success from './Success';
import Navbar from './Navbar';
//Externos: funciones de autenticación
import { isAuthenticated, getUser, logout } from './Auth';
//Fontawesome for icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Import libraries for FontAwesome icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
// Añadir íconos a la biblioteca global
library.add(fas, far, fab);

//Funciones locales
import {
  ProtectedRoute,
  useUser,
  useAuthEffect,
  useDbStatus,
  useDropdown,
  updateSessionExpiry,
  useActivityListener,
  handleLogout,
  handleSetup
} from './locallib';



function App() {
  // Estado para guardar el usuario autenticado, persistido en localStorage con su tiempo de expiración
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    const savedExpiry = localStorage.getItem('expiry');
    const now = new Date().getTime();
    if (savedUser && savedExpiry && now < savedExpiry) {
      return JSON.parse(savedUser);
    }
    localStorage.removeItem('user');
    localStorage.removeItem('expiry');
    closeDropdown();
    return null;
  });

  // Estado para mostrar el estado de la conexión a la base de datos
  const [dbStatus, setDbStatus] = useState('');

  // Estado para controlar si el dropdown del usuario está abierto
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Efecto para actualizar el estado del usuario si está autenticado, y guardar la expiración de la sesión
  useEffect(() => {
    const authenticatedUser = getUser();
    if (authenticatedUser) {
      setUser(authenticatedUser);
      const expiryTime = new Date().getTime() + 2 * 60 * 60 * 1000; // 2 horas
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      localStorage.setItem('expiry', expiryTime);
    }
  }, []);

  // Función para probar la conexión a la base de datos. Hace una petición a "/api/dbTest.php".
  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        const response = await fetch("/api/dbTest.php");
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }
        const data = await response.json();
        setDbStatus(data.success ? 'Conexión exitosa a la base de datos' : 'Error al conectar con la base de datos');
      } catch (error) {
        setDbStatus('Error al conectar con la base de datos: ' + error.message);
      }
    };
    checkDbConnection();
  }, []);


  useAuthEffect(setUser);
  useActivityListener(user, updateSessionExpiry);
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        {/* Navbar importado desde el archivo Navbar.js */}
        <Navbar 
          user={user} 
          setUser={setUser} 
          dbStatus={dbStatus} 
          handleSetup={handleSetup} 
          updateSessionExpiry={updateSessionExpiry}
        />
        {/* Contenido principal con flex-grow para ocupar el espacio restante */}
        <main className="flex-grow p-4" onClick={updateSessionExpiry}>
          {/* Mostrar el estado de la conexión a la base de datos */}
          <p>{dbStatus}</p>
          {/* Rutas definidas para la navegación */}
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/login" element={<Login setUser={(user) => {
              setUser(user);
              const expiryTime = new Date().getTime() + 2 * 60 * 60 * 1000; // 2 horas
              localStorage.setItem('user', JSON.stringify(user));
              localStorage.setItem('expiry', expiryTime);
            }} />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
  
}

export default App;
