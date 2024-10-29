// Función para obtener el token desde localStorage
export function getToken() {
    return localStorage.getItem('token');
  }
  
  // Función para obtener la información del usuario desde el token JWT
  export function getUser() {
    const token = getToken();
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Verificar si el token ha expirado
      const now = Math.floor(Date.now() / 1000);  // Tiempo actual en segundos
      if (payload.exp < now) {
        logout();  // El token ha expirado, cerrar sesión
        return null;
      }
      return payload;  // Devuelve la información del usuario (por ejemplo, id, username)
    } catch (error) {
      console.error('Error decodificando el token', error);
      return null;
    }
  }
  
  // Función para verificar si el usuario está autenticado
  export function isAuthenticated() {
    return getUser() !== null;
  }
  
  // Función para cerrar sesión
  export function logout() {
    localStorage.removeItem('token');
  }
  