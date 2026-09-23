# FIFA Analytics API

API RESTful construida con Node.js, Express y MongoDB Atlas para consultar y administrar los datos del Mundial de Rusia 2018.

Este proyecto nace como respuesta a una necesidad concreta: la empresa ficticia **FIFA Analytics S.A.S.** tenía la información del Mundial regada en hojas de Excel y documentos sueltos, lo que dificultaba las consultas. La solución fue construir un backend que centralice los equipos, jugadores y partidos en una base de datos NoSQL, y exponerla mediante endpoints REST.

## Tabla de contenido

- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Cargar los datos](#cargar-los-datos)
- [Ejecutar el servidor](#ejecutar-el-servidor)
- [Endpoints disponibles](#endpoints-disponibles)
- [Ejemplos de uso](#ejemplos-de-uso)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Problemas comunes](#problemas-comunes)
- [Tecnologías usadas](#tecnologías-usadas)
- [Aprendizajes](#aprendizajes)
- [Autor](#autor)

## Requisitos previos

Antes de empezar, asegúrate de tener instalado:

- **Node.js** (versión LTS, la 20 o superior) — [descargar aquí](https://nodejs.org)
- **Cuenta en MongoDB Atlas** (es gratis) — [registrarse aquí](https://www.mongodb.com/cloud/atlas/register)
- **Postman** o similar para probar los endpoints (opcional pero recomendado) — [descargar aquí](https://www.postman.com/downloads)
- **Git** para clonar el repositorio — [descargar aquí](https://git-scm.com)

Para verificar que tienes Node.js instalado:

```bash
node --version
npm --version
```

## Instalación

1. Clona el repositorio o descomprime el ZIP:

```bash
git clone https://github.com/JorgeAHernandezC80/fifa-analytics-api.git
cd fifa-analytics-api
```

2. Instala las dependencias:

```bash
npm install
```

## Configuración

1. Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

En Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

2. Abre `.env` y ajusta las variables:

```env
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/mundial2018?retryWrites=true&w=majority
NODE_ENV=development
```

**Importante sobre la cadena de conexión:**

- Reemplaza `usuario` y `password` con las credenciales de MongoDB Atlas.
- Reemplaza `cluster0.xxxxx.mongodb.net` con el nombre real de tu cluster.
- La parte `/mundial2018` es el nombre de la base de datos.
- Si la contraseña tiene caracteres especiales (`@`, `#`, `%`, `&`, `/`, `:`), debes codificarlos. Por ejemplo, `@` se convierte en `%40`.

## Cargar los datos

Antes de arrancar el servidor, hay que poblar la base. Ejecuta los scripts en este orden:

```bash
node scripts/01_crear_bd.js
node scripts/02_seed_equipos.js
node scripts/03_seed_jugadores.js
node scripts/04_seed_partidos.js
```

Al final deberías tener:

- **32 equipos**
- **46 jugadores** (los de Colombia y Japón, que estaban en el anexo de prueba)
- **60 partidos**

Verifica en `mongosh`:

```javascript
use("mundial2018")
db.equipos.countDocuments()
db.jugadores.countDocuments()
db.partidos.countDocuments()
```

## Ejecutar el servidor

Para desarrollo (con recarga automática):

```bash
npm run dev
```

Para producción:

```bash
npm start
```

Deberías ver:

```
✅ MongoDB conectado: ac-xxxxx-shard-00-00.unek3kp.mongodb.net
📦 Base de datos: mundial2018
🚀 Servidor corriendo en http://localhost:3000
```

Abre el navegador en `http://localhost:3000`.

## Endpoints disponibles

### Equipos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/equipos` | Lista todos los equipos |
| GET | `/api/equipos/:abbr` | Trae un equipo y sus jugadores |
| GET | `/api/equipos/:abbr/stats` | Estadísticas del equipo |
| POST | `/api/equipos` | Crea un equipo nuevo |
| PATCH | `/api/equipos/:abbr` | Actualiza un equipo |
| DELETE | `/api/equipos/:abbr` | Elimina un equipo |

### Jugadores

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/jugadores` | Lista todos los jugadores |
| GET | `/api/jugadores/equipo/:equipo` | Jugadores de un equipo |
| GET | `/api/jugadores/stats/:equipo` | Estadísticas |
| GET | `/api/jugadores/:id` | Un jugador por _id |
| POST | `/api/jugadores` | Crea un jugador |
| PATCH | `/api/jugadores/:id` | Actualiza |
| DELETE | `/api/jugadores/:id` | Elimina |

### Partidos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/partidos` | Lista todos los partidos |
| GET | `/api/partidos/equipo/:equipo` | Partidos de un equipo |
| GET | `/api/partidos/:id` | Un partido por _id |
| POST | `/api/partidos` | Crea un partido |
| PATCH | `/api/partidos/:id` | Actualiza |
| DELETE | `/api/partidos/:id` | Elimina |

### Filtros opcionales

En `GET /api/jugadores`:

- `?equipo=Colombia` — filtra por equipo
- `?posicion=GK` — filtra por posición
- `?estaturaMax=170` — estatura menor a 170 cm
- `?estaturaMin=190` — estatura mayor a 190 cm

## Ejemplos de uso

**Listar equipos:**

```bash
curl http://localhost:3000/api/equipos
```

**Ver Colombia con sus jugadores:**

```bash
curl http://localhost:3000/api/equipos/col
```

**Estadísticas de Colombia:**

```bash
curl http://localhost:3000/api/equipos/col/stats
```

**Crear un equipo:**

```bash
curl -X POST http://localhost:3000/api/equipos \
  -H "Content-Type: application/json" \
  -d '{"id": 33, "abreviatura": "uru", "pais": "Uruguay", "confederacion": "CONMEBOL"}'
```

## Estructura del proyecto

Patrón MVC (Modelo-Vista-Controlador):

```
fifa-analytics-api/
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── server.js
├── config/
│   └── database.js
├── controllers/
│   ├── equipoController.js
│   ├── jugadorController.js
│   └── partidoController.js
├── models/
│   ├── Equipo.js
│   ├── Jugador.js
│   └── Partido.js
├── routes/
│   ├── equipoRoutes.js
│   ├── jugadorRoutes.js
│   └── partidoRoutes.js
├── middlewares/
│   └── errorHandler.js
├── scripts/
│   ├── 01_crear_bd.js
│   ├── 02_seed_equipos.js
│   ├── 03_seed_jugadores.js
│   └── 04_seed_partidos.js
└── docs/
    └── informe-AA2-EV01.md
```

## Problemas comunes

**Error: `querySrv ECONNREFUSED`**

Ocurre en Windows cuando Node.js no puede resolver el DNS de MongoDB Atlas. Solución: forzar DNS público al inicio de `config/database.js`:

```javascript
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
```

**Error: `bad auth: Authentication failed`**

- Contraseña mal escrita en `.env`
- Caracteres especiales sin codificar (`@` → `%40`)
- IP no autorizada en MongoDB Atlas (ve a Network Access y agrega `0.0.0.0/0` para desarrollo)

**Error: `E11000 duplicate key error`**

Un documento con ese `id` o `abreviatura` ya existe. Solución:

```javascript
db.equipos.deleteMany({})
```

**Error: `Port 3000 already in use`**

Cambia el puerto en `.env` o mata el proceso:

```bash
npx kill-port 3000
```

**`/api/equipos` devuelve `[]`**

La colección está vacía. Ejecuta los scripts de seed.

## Tecnologías usadas

| Tecnología | Versión | Para qué |
|------------|---------|----------|
| Node.js | LTS (20+) | Entorno de ejecución |
| Express | 5.x | Framework del servidor |
| Mongoose | 9.x | Modelado de datos |
| MongoDB Atlas | Cloud | Base de datos NoSQL |
| dotenv | 18.x | Variables de entorno |
| cors | 2.8.x | Permisos para consumir la API |
| nodemon | 3.x | Recarga automática |

## Aprendizajes

Algunas cosas que aprendí construyendo esta API:

- **NoSQL no significa "sin esquema".** Aunque MongoDB es flexible, conviene definir validaciones en Mongoose para que los datos sean consistentes.
- **El embedding no siempre es la mejor opción.** Al principio quería meter los jugadores dentro de los equipos, pero al final los separé porque las consultas del proyecto lo pedían así.
- **Los índices únicos pueden causar problemas.** Cuando cambié el nombre de un campo, el índice viejo seguía ahí y rechazaba los inserts. Hay que eliminarlo con `dropIndex()`.
- **Los errores de DNS son comunes con MongoDB Atlas en Windows.** El workaround de forzar DNS público resuelve el 90% de los casos.
- **Documentar el proyecto es tan importante como programarlo.** Un README claro ahorra tiempo a quien vaya a usar la API.

## Autor

**Jorge A. Hernández C.**

Aprendiz del programa **Desarrollo Backend con Node.JS y MongoDB**
Servicio Nacional de Aprendizaje (SENA)

- GitHub: [@JorgeAHernandezC80](https://github.com/JorgeAHernandezC80)

## Evidencia

Este proyecto corresponde a la evidencia **AA2-EV01 — Código fuente API RESTful y Scripts BD**, de la actividad de aprendizaje AA2 — Codificar la API RESTful utilizando las características de Node.js.

## Licencia

Este proyecto es de uso educativo. Puedes usarlo como referencia para tus propios proyectos.

---

*Última actualización: Septiembre 2026*