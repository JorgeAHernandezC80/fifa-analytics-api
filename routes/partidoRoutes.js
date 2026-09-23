const express = require('express');
const partidoController = require('../controllers/partidoController');

const router = express.Router();

// Rutas para /api/partidos
router
  .route('/')
  .get(partidoController.getAllPartidos)
  .post(partidoController.createPartido);

// Rutas específicas (deben ir ANTES de /:id)
router.get('/equipo/:equipo', partidoController.getPartidosByEquipo);

// Rutas por _id (van al final)
router
  .route('/:id')
  .get(partidoController.getPartidoById)
  .patch(partidoController.updatePartido)
  .delete(partidoController.deletePartido);

module.exports = router;