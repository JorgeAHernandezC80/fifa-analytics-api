require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const equipoRoutes = require('./routes/equipoRoutes');
const jugadorRoutes = require('./routes/jugadorRoutes');
const partidoRoutes = require('./routes/partidoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta raíz (health check)
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'FIFA Analytics API funcionando',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/equipos', equipoRoutes);
app.use('/api/jugadores', jugadorRoutes);
app.use('/api/partidos', partidoRoutes);

// Middleware de errores (debe ir al final, después de las rutas)
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor'
  });
});

// Arrancar servidor
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 Endpoints disponibles:`);
    console.log(`   GET    /api/equipos`);
    console.log(`   GET    /api/equipos/:abbr`);
    console.log(`   GET    /api/equipos/:abbr/stats`);
    console.log(`   POST   /api/equipos`);
    console.log(`   PATCH  /api/equipos/:abbr`);
    console.log(`   DELETE /api/equipos/:abbr`);
    console.log(`   GET    /api/jugadores`);
    console.log(`   GET    /api/jugadores/equipo/:equipo`);
    console.log(`   GET    /api/jugadores/:id`);
    console.log(`   POST   /api/jugadores`);
    console.log(`   PATCH  /api/jugadores/:id`);
    console.log(`   DELETE /api/jugadores/:id`);
    console.log(`   GET    /api/partidos`);
    console.log(`   POST   /api/partidos`);
    console.log(`   PATCH  /api/partidos/:id`);
    console.log(`   DELETE /api/partidos/:id`);
  });
};

startServer();