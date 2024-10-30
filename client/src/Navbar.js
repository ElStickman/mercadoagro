// React must import.
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Funciones de autenticación.
import { logout } from './Auth';

function Navbar({ user, setUser, dbStatus, handleSetup, updateSessionExpiry }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Función para alternar el estado de apertura del dropdown de usuario.
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Función para cerrar el dropdown
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Función para cerrar sesión y limpiar el almacenamiento local.
  const handleLogout = useCallback(() => {
    logout();
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('expiry');
    closeDropdown(); // Cerrar el dropdown al hacer logout
  }, [setUser]);

  return (
    <nav className="p-4 bg-gray-100 flex justify-between items-center" onClick={updateSessionExpiry}>
      <div className="flex space-x-8">
        {/* Enlaces de navegación */}
        <Link to="/" className="text-left">
          Inicio {dbStatus.includes('exitosa') ? '🟢' : '🔴'}
        </Link>
        <Link to="/about" className="text-left">
          Sobre Nosotros
        </Link>
      </div>
      {/* Sección de usuario y opciones */}
      <div className="flex space-x-4 items-center">
        {/* Botón para ejecutar el setup */}
        <button onClick={handleSetup} className="text-blue-500">
          Setup
        </button>
        {user ? (
          <>
            <div className="relative inline-block text-left ml-4">
              {/* Botón para mostrar el nombre del usuario con dropdown */}
              <button onClick={toggleDropdown} className="flex items-center">
                Hola, {user.username}{' '}
                <FontAwesomeIcon
                  icon="fa-solid fa-chevron-down"
                  className="ml-2"
                  style={{ fontSize: '0.75em' }}
                />
              </button>

              {/* Dropdown para mostrar las opciones del usuario */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {/* Enlace a "Mis publicaciones" */}
                    <Link
                      to="/my-posts"
                      className="block px-2 py-2 text-sm hover:bg-gray-200 transition duration-10"
                      onClick={closeDropdown}
                    >
                      Mis publicaciones
                    </Link>
                    {/* Enlace a "Nueva publicación" */}
                    <Link
                      to="/new-post"
                      className="block px-2 py-2 text-sm hover:bg-gray-200 transition duration-10"
                      onClick={closeDropdown}
                    >
                      Nueva publicación
                    </Link>
                    {/* Botón para cerrar sesión */}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-2 py-2 text-sm hover:bg-gray-200 transition duration-10"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Enlace para crear usuario */}
            <Link to="/register" className="text-left">
              Crear Usuario
            </Link>
            {/* Enlace para iniciar sesión */}
            <Link to="/login" className="text-left">
              Iniciar Sesión
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
