# Instrucciones de Instalación y Configuración de MercadoAgro

Estas son las instrucciones detalladas para poner en marcha el proyecto **MercadoAgro** en un entorno nuevo. Sigue cada paso para configurar tu entorno y ejecutar la aplicación correctamente.

## 1. Requisitos Previos

Asegúrate de tener los siguientes elementos instalados en tu sistema:

- **Node.js** (versión 18.x)
  - Puedes instalarlo ejecutando:
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

- **npm** (normalmente viene con Node.js)

- **MariaDB**
  - Para instalar MariaDB:
    ```bash
    sudo apt update
    sudo apt install mariadb-server
    ```

- **Git**
  - Para clonar el repositorio y manejar versiones:
    ```bash
    sudo apt install git
    ```

## 2. Clonar el Repositorio

Clona el repositorio desde GitHub a tu máquina local ejecutando:

```bash
git clone https://github.com/ElStickman/mercadoagro.git
```

Navega al directorio del proyecto:

```bash
cd mercadoagro
```

## 3. Configuración de Base de Datos

### 3.1 Configurar MariaDB

Ejecuta el siguiente comando para abrir la consola de MariaDB:

```bash
sudo mysql -u root
```

Crea la base de datos y el usuario para **MercadoAgro**:

```sql
CREATE DATABASE mercadoagro DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mercadoagro'@'localhost' IDENTIFIED BY 'CHANGEMEPASSWORD';
GRANT ALL PRIVILEGES ON mercadoagro.* TO 'mercadoagro'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3.2 Configurar Variables de Entorno

Crea un archivo `.env` en el directorio `server` con el siguiente contenido:

```env
ADMIN_PASSWORD=changeme
REACT_DB_HOST=localhost
REACT_DB_USER=mercadoagro
REACT_DB_DBNAME=mercadoagro
REACT_DB_PASSWORD=changeme
```

## 4. Instalación de Dependencias

### 4.1 Dependencias del Servidor

Navega al directorio `server` y ejecuta:

```bash
cd server
npm install
```

### 4.2 Dependencias del Cliente

Navega al directorio `client` y ejecuta:

```bash
cd ../client
npm install
```

## 5. Creación de Tablas en la Base de Datos

Ejecuta el script para crear las tablas necesarias en la base de datos:

```bash
cd ../server
node createTables.js --reset
```

Esto eliminará la base de datos si existe y la volverá a crear junto con todas las tablas necesarias.

## 6. Ejecutar el Servidor y el Cliente

### 6.1 Ejecutar el Servidor

Desde el directorio `server`, ejecuta:

```bash
npm start
```

### 6.2 Ejecutar el Cliente

Navega al directorio `client` y ejecuta:

```bash
npm start
```

Esto iniciará la aplicación en modo desarrollo. Podrás acceder al cliente desde tu navegador en `http://localhost:3000`.

## 7. Opcional: Instalar PM2 para Producción
Si deseas ejecutar el servidor en un entorno de producción, puedes utilizar **PM2** para mantener la aplicación ejecutándose continuamente:

```bash
sudo npm install -g pm2
pm2 start server.js --name mercadoagro-server
pm2 save
pm2 startup
```

Esto asegurará que el servidor se inicie automáticamente incluso después de un reinicio del sistema.

## 8. Problemas Comunes

- **Error de Conexión a la Base de Datos**: Verifica que las credenciales en el archivo `.env` coincidan con las configuradas en MariaDB.
- **Dependencias Faltantes**: Asegúrate de haber ejecutado `npm install` en los directorios `server` y `client`.



