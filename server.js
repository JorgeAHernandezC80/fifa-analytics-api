require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const equipoRoutes = require('./routes/equipoRoutes');
const jugadorRoutes = require('./routes/jugadorRoutes');
const partidoRoutes = require('./routes/partidoRoutes');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// GET /
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'FIFA Analytics API funcionando',
    timestamp: new Date().toISOString()
  });
});

// /api/equipos
app.use('/api/equipos', equipoRoutes);
// /api/jugadores
app.use('/api/jugadores', jugadorRoutes);
// /api/partidos
app.use('/api/partidos', partidoRoutes);

// Siempre al final: primero la ruta no encontrada, luego el manejador de errores
app.use(notFound);
app.use(errorHandler);

// Arrancar servidor (primero la conexión, después el puerto)
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
    console.log(`   GET    /api/jugadores/stats/:equipo`);
    console.log(`   GET    /api/jugadores/:id`);
    console.log(`   POST   /api/jugadores`);
    console.log(`   PATCH  /api/jugadores/:id`);
    console.log(`   DELETE /api/jugadores/:id`);
    console.log(`   GET    /api/partidos`);
    console.log(`   GET    /api/partidos/equipo/:equipo`);
    console.log(`   GET    /api/partidos/:id`);
    console.log(`   POST   /api/partidos`);
    console.log(`   PATCH  /api/partidos/:id`);
    console.log(`   DELETE /api/partidos/:id`);
  });
};

startServer();
