# FIFA Analytics API

API RESTful construida con Node.js, Express y MongoDB para consultar y administrar los datos del Mundial de Rusia 2018.

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
- **MongoDB Community Server** 6.0 o superior, corriendo en tu equipo — [descargar aquí](https://www.mongodb.com/try/download/community) (o una cuenta gratuita de MongoDB Atlas)
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

2. El `.env.example` ya viene listo para MongoDB local, así que normalmente no hay que cambiar nada:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/mundial2018
```

**Sobre la cadena de conexión:**

- Se usa `127.0.0.1` y no `localhost`: desde Node 17, `localhost` se resuelve a IPv6 (`::1`) y MongoDB local solo escucha en IPv4, lo que produce `ECONNREFUSED`.
- La parte `/mundial2018` es el nombre de la base de datos.
- Para usar **MongoDB Atlas**, reemplaza la URI por la de tu clúster (`mongodb+srv://usuario:password@...`). Si la contraseña tiene caracteres especiales (`@`, `#`, `%`, `&`, `/`, `:`), debes codificarlos: `@` se convierte en `%40`.

## Cargar los datos

Antes de arrancar el servidor hay que crear y poblar la base. Con un solo comando:

```bash
npm run seed
```

O paso a paso, en este orden:

```bash
node scripts/01_crear_bd.js         # colecciones con validación $jsonSchema e índices
node scripts/02_seed_equipos.js     # carga data/equipos.json
node scripts/03_seed_jugadores.js   # carga data/jugadores.json
node scripts/04_seed_partidos.js    # carga data/partidos.json y muestra el resumen
```

Todos los scripts se pueden ejecutar varias veces: el 01 recrea las colecciones y los demás borran los datos anteriores antes de insertar, así que nunca se duplican registros.

Al final deberías tener:

- **32 equipos**
- **46 jugadores** (los de Colombia y Japón, que estaban en el anexo de prueba)
- **60 partidos**

Verifica en `mongosh`:

```javascript
use mundial2018
db.equipos.countDocuments()
db.jugadores.countDocuments()
db.partidos.countDocuments()
```

### ¿De dónde salen los datos?

Los archivos de `data/` se generaron una sola vez desde MongoDB Atlas con `npm run db:exportar` (`scripts/00_exportar_datos.js`). Están en formato Extended JSON, que conserva los `ObjectId` y las fechas originales. Ese script también revisa la calidad de los datos: confederaciones, duplicados y relaciones entre colecciones.

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

### Códigos de respuesta

| Código | Cuándo |
|--------|--------|
| 200 | Consulta o actualización exitosa |
| 201 | Registro creado (POST) |
| 204 | Registro eliminado (DELETE) |
| 400 | JSON mal formado o `_id` con formato inválido |
| 404 | El registro o la ruta no existen |
| 409 | Registro duplicado (`id`, `abreviatura` o dorsal repetido en un equipo) |
| 422 | Datos que no cumplen las validaciones (campo obligatorio, confederación o posición inválida...) |

Los errores responden así:

```json
{
  "status": "fail",
  "message": "Datos inválidos",
  "errores": [{ "campo": "confederacion", "mensaje": "FIFA no es una confederación válida" }]
}
```

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
│   ├── lib/conexion.js          # conexión y carga compartidas por los scripts
│   ├── 00_exportar_datos.js     # (solo el autor) exporta desde Atlas a data/
│   ├── 01_crear_bd.js
│   ├── 02_seed_equipos.js
│   ├── 03_seed_jugadores.js
│   ├── 04_seed_partidos.js
│   └── diagnostico.js
├── data/
│   ├── equipos.json
│   ├── jugadores.json
│   └── partidos.json
└── docs/
    └── informe-AA2-EV01.docx
```

## Problemas comunes

**Error: `connect ECONNREFUSED 127.0.0.1:27017`**

El servicio de MongoDB local no está corriendo. En Windows, abre "Servicios" e inicia **MongoDB Server**, o ejecuta `net start MongoDB` como administrador.

**Error: `querySrv ECONNREFUSED`** (solo con Atlas)

Ocurre en Windows cuando Node.js no puede resolver el DNS de MongoDB Atlas. Solución: forzar DNS público al inicio de `config/database.js`:

```javascript
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
```

**Error: `bad auth: Authentication failed`**

- Contraseña mal escrita en `.env`
- Caracteres especiales sin codificar (`@` → `%40`)
- IP no autorizada en MongoDB Atlas: ve a Network Access y usa **Add Current IP Address** (evita `0.0.0.0/0`, que permite conexiones desde cualquier lugar)

**Error: `E11000 duplicate key error`**

Ya existe un documento con ese `id`, `abreviatura` o dorsal. Busca el registro repetido en lugar de borrar la colección:

```javascript
db.equipos.find({ abreviatura: "uru" })
```

Si lo que quieres es volver a los datos originales, ejecuta `npm run seed`.

**Error: `Port 3000 already in use`**

Cambia el puerto en `.env` o mata el proceso:

```bash
npx kill-port 3000
```

**`/api/equipos` devuelve `[]`**

La colección está vacía. Ejecuta `npm run seed`.

## Tecnologías usadas

| Tecnología | Versión | Para qué |
|------------|---------|----------|
| Node.js | LTS (20+) | Entorno de ejecución |
| Express | 5.x | Framework del servidor |
| Mongoose | 9.x | Modelado de datos |
| MongoDB | 6.0+ (local o Atlas) | Base de datos NoSQL |
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