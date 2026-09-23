# FIFA Analytics API

API RESTful construida con Node.js, Express y MongoDB para consultar datos del Mundial de Rusia 2018.

## Requisitos previos

- Node.js (versión LTS)
- Cuenta en MongoDB Atlas (gratuita)
- Postman (opcional, para probar)

## Instalación

1. Clonar o descomprimir el proyecto:
   ```bash
   cd fifa-analytics-api
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Copiar el archivo `.env.example` a `.env` y configurar:
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus credenciales:
   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/mundial2018?retryWrites=true&w=majority
   NODE_ENV=development
   ```

4. Cargar los datos iniciales:
   ```bash
   node scripts/01_crear_bd.js
   node scripts/02_seed_equipos.js
   node scripts/03_seed_jugadores.js
   node scripts/04_seed_partidos.js
   ```

5. Arrancar el servidor:
   ```bash
   npm run dev
   ```

6. Abrir en el navegador:
   ```
   http://localhost:3000
   ```

## Endpoints

### Equipos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/equipos` | Lista todos los equipos |
| GET | `/api/equipos/:abbr` | Equipo + sus jugadores |
| GET | `/api/equipos/:abbr/stats` | Estadísticas del equipo |
| POST | `/api/equipos` | Crea un equipo |
| PATCH | `/api/equipos/:abbr` | Actualiza un equipo |
| DELETE | `/api/equipos/:abbr` | Elimina un equipo |

### Jugadores

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/jugadores` | Lista todos los jugadores |
| GET | `/api/jugadores/equipo/:equipo` | Jugadores de un equipo |
| GET | `/api/jugadores/stats/:equipo` | Estadísticas |
| GET | `/api/jugadores/:id` | Un jugador |
| POST | `/api/jugadores` | Crea un jugador |
| PATCH | `/api/jugadores/:id` | Actualiza |
| DELETE | `/api/jugadores/:id` | Elimina |

### Partidos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/partidos` | Lista todos |
| GET | `/api/partidos/equipo/:equipo` | Partidos de un equipo |
| GET | `/api/partidos/:id` | Un partido |
| POST | `/api/partidos` | Crea |
| PATCH | `/api/partidos/:id` | Actualiza |
| DELETE | `/api/partidos/:id` | Elimina |

## 🧪 Ejemplos de uso

**Listar equipos:**
```bash
curl http://localhost:3000/api/equipos
```

**Ver Colombia y sus jugadores:**
```bash
curl http://localhost:3000/api/equipos/col
```

**Crear un equipo:**
```bash
curl -X POST http://localhost:3000/api/equipos \
  -H "Content-Type: application/json" \
  -d '{"id": 33, "abreviatura": "uru", "pais": "Uruguay", "confederacion": "CONMEBOL"}'
```

## Estructura del proyecto

```
fifa-analytics-api/
├── config/          # Conexión a MongoDB
├── models/          # Esquemas de Mongoose
├── controllers/     # Lógica de negocio
├── routes/          # Definición de endpoints
├── middlewares/     # Manejo de errores
├── scripts/         # Scripts de seed
└── server.js        # Punto de entrada
```

## Notas

- El archivo `.env` NO se incluye en el ZIP por seguridad. Usa `.env.example` como plantilla.
- Si tienes problemas de DNS con MongoDB Atlas, agrega esto al inicio de `config/database.js`:
  ```javascript
  const dns = require('dns');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  ```
- Si la contraseña tiene caracteres especiales (`@`, `#`, `%`, `&`), codifícalos en la URL.

## Autor

Jorge Andres Hernandez Campos — Aprendiz SENA
Programa: Desarrollo Backend con Node.JS y MongoDB