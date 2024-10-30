import { useEffect, useCallback, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getUser, isAuthenticated, logout } from './Auth';

// Componente para proteger las rutas
// Verifica si el usuario está autenticado. Si lo está, renderiza los componentes hijos, si no, redirige a la página de login.
function ProtectedRoute({ children }) {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  }
  

// Estado inicial del usuario autenticado, persistido en localStorage con su tiempo de expiración
export function useUser() {
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
  
  return [user, setUser];
}

// Estado inicial del dropdown de usuario
export function useDropdown() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const toggleDropdown = () => {
      setIsDropdownOpen(prev => !prev);
    };
  
    const closeDropdown = () => {
      setIsDropdownOpen(false);
    };
  
    return { isDropdownOpen, toggleDropdown, closeDropdown };
  }
  

// Actualiza el estado del usuario autenticado y guarda la expiración de la sesión
export function useAuthEffect(setUser) {
  useEffect(() => {
    const authenticatedUser = getUser();
    if (authenticatedUser) {
      setUser(authenticatedUser);
      const expiryTime = new Date().getTime() + 2 * 60 * 60 * 1000; // 2 horas
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      localStorage.setItem('expiry', expiryTime);
    }
  }, [setUser]);
}

// Probar la conexión a la base de datos
export function useDbStatus() {
  const [dbStatus, setDbStatus] = useState('');

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

  return dbStatus;
}

// Función para actualizar la expiración de la sesión en cada interacción del usuario
export function updateSessionExpiry(user) {
  if (user) {
    const expiryTime = new Date().getTime() + 2 * 60 * 60 * 1000; // 2 horas
    localStorage.setItem('expiry', expiryTime);
  }
}

// Escucha eventos de clic y teclado para actualizar la expiración de la sesión
export function useActivityListener(user, updateSessionExpiry) {
  useEffect(() => {
    const handleActivity = () => {
      updateSessionExpiry(user);
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [user, updateSessionExpiry]);
}

// Función para cerrar sesión
export function handleLogout(setUser) {
  logout();
  setUser(null);
  localStorage.removeItem('user');
  localStorage.removeItem('expiry');
}

// Función para ejecutar el setup del backend
export async function handleSetup() {
  try {
    const response = await fetch('/api/setup.php');
    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }
    const data = await response.json();
    alert(data.success ? 'Setup completado exitosamente' : 'Error al ejecutar setup');
  } catch (error) {
    alert('Error al ejecutar setup: ' + error.message);
  }
}
