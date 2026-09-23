const express = require('express');
const equipoController = require('../controllers/equipoController');

const router = express.Router();

router
  .route('/')
  // GET /api/equipos
  .get(equipoController.getAllEquipos)
  // POST /api/equipos
  .post(equipoController.createEquipo);

router
  .route('/:abbr')
  // GET /api/equipos/:abbr
  .get(equipoController.getEquipoByAbbr)
  // PATCH /api/equipos/:abbr
  .patch(equipoController.updateEquipo)
  // DELETE /api/equipos/:abbr
  .delete(equipoController.deleteEquipo);

// GET /api/equipos/:abbr/stats
router.get('/:abbr/stats', equipoController.getEquipoStats);

module.exports = router;
