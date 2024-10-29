import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import About from './About';
import Register from './Register';
import Login from './Login';
import Success from './Success';
import { isAuthenticated, getUser, logout } from './Auth';  // Importar funciones de autenticación
import { Navigate } from 'react-router-dom';  // Importar Navigate para redirección

// Componente para proteger las rutas
function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  const [user, setUser] = useState(null);  // Estado del usuario
  const [dbStatus, setDbStatus] = useState('');  // Estado de la conexión a la base de datos

  // Actualizar el estado del usuario cuando se carga la aplicación
  useEffect(() => {
    const authenticatedUser = getUser();  // Obtener la información del usuario
    setUser(authenticatedUser);  // Actualizar el estado del usuario

    // Probar la conexión a la base de datos
    fetch("/api/dbTest.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setDbStatus('Conexión exitosa a la base de datos');
        } else {
          setDbStatus('Error al conectar con la base de datos');
        }
      })
      .catch((error) => {
        setDbStatus('Error al conectar con la base de datos: ' + error.message);
      });
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);  // Limpiar el estado del usuario al cerrar sesión
  };

  return (
    <Router>
      <Header />
      <nav className="p-4 bg-gray-100 flex justify-between">
        <div className="flex space-x-8">
          <Link to="/" className="text-green-500">Inicio {dbStatus.includes('exitosa') ? '🟢' : '🔴'}</Link>
          <Link to="/about" className="text-green-500">Sobre Nosotros</Link>
        </div>
        <div className="flex space-x-4">
          <button onClick={() => {
            fetch('/api/setup.php')
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Error del servidor: ${response.status}`);
                }
                return response.json();
              })
              .then(data => {
                if (data.success) {
                  alert('Setup completado exitosamente');
                } else {
                  alert('Error al ejecutar setup');
                }
              })
              .catch(error => {
                alert('Error al ejecutar setup: ' + error.message);
              });
          }} className="text-blue-500">Setup</button>
          {/* Mostrar opciones basadas en el estado del usuario */}
          {user ? (
            <>
              <span className="text-green-500">Hola, {user.username}</span>  {/* Mostrar nombre del usuario */}
              <button onClick={handleLogout} className="text-red-500">Cerrar Sesión</button>  {/* Botón para cerrar sesión */}
            </>
          ) : (
            <>
              <Link to="/register" className="text-green-500">Crear Usuario</Link>
              <Link to="/login" className="text-green-500">Iniciar Sesión</Link>
            </>
          )}
        </div>
      </nav>
      <main className="p-4">
        <p>{dbStatus}</p>  {/* Mostrar estado de la conexión a la base de datos */}
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register setUser={setUser} />} />  {/* Pasar setUser como prop */}
          <Route path="/login" element={<Login setUser={setUser} />} />  {/* Pasar setUser como prop */}
          <Route path="/success" element={<Success />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
