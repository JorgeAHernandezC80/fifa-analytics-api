const express = require('express');
const jugadorController = require('../controllers/jugadorController');

const router = express.Router();

// Rutas para /api/jugadores
router
  .route('/')
  .get(jugadorController.getAllJugadores)
  .post(jugadorController.createJugador);

// Rutas específicas (deben ir ANTES de /:id para no colisionar)
router.get('/equipo/:equipo', jugadorController.getJugadoresByEquipo);
router.get('/stats/:equipo', jugadorController.getEstadisticasJugadores);

// Rutas por _id (van al final)
router
  .route('/:id')
  .get(jugadorController.getJugadorById)
  .patch(jugadorController.updateJugador)
  .delete(jugadorController.deleteJugador);

module.exports = router;