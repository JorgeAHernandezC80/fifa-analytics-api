const express = require('express');
const partidoController = require('../controllers/partidoController');

const router = express.Router();

router
  .route('/')
  // GET /api/partidos
  .get(partidoController.getAllPartidos)
  // POST /api/partidos
  .post(partidoController.createPartido);

// Rutas específicas (deben ir ANTES de /:id)

// GET /api/partidos/equipo/:equipo
router.get('/equipo/:equipo', partidoController.getPartidosByEquipo);

router
  .route('/:id')
  // GET /api/partidos/:id
  .get(partidoController.getPartidoById)
  // PATCH /api/partidos/:id
  .patch(partidoController.updatePartido)
  // DELETE /api/partidos/:id
  .delete(partidoController.deletePartido);

module.exports = router;
