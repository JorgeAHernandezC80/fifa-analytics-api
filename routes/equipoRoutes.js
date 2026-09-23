const express = require('express');
const equipoController = require('../controllers/equipoController');

const router = express.Router();

router
  .route('/')
  .get(equipoController.getAllEquipos)
  .post(equipoController.createEquipo);

router
  .route('/:abbr')
  .get(equipoController.getEquipoByAbbr)
  .patch(equipoController.updateEquipo)
  .delete(equipoController.deleteEquipo);

router.get('/:abbr/stats', equipoController.getEquipoStats);

module.exports = router;