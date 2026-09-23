const express = require('express');
const jugadorController = require('../controllers/jugadorController');

const router = express.Router();

router
  .route('/')
  // GET /api/jugadores
  .get(jugadorController.getAllJugadores)
  // POST /api/jugadores
  .post(jugadorController.createJugador);

// Rutas específicas (deben ir ANTES de /:id para no colisionar)

// GET /api/jugadores/equipo/:equipo
router.get('/equipo/:equipo', jugadorController.getJugadoresByEquipo);

// GET /api/jugadores/stats/:equipo
router.get('/stats/:equipo', jugadorController.getEstadisticasJugadores);

router
  .route('/:id')
  // GET /api/jugadores/:id
  .get(jugadorController.getJugadorById)
  // PATCH /api/jugadores/:id
  .patch(jugadorController.updateJugador)
  // DELETE /api/jugadores/:id
  .delete(jugadorController.deleteJugador);

module.exports = router;
