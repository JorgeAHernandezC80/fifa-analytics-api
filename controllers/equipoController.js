const Equipo = require('../models/Equipo');
const Jugador = require('../models/Jugador');

// GET /api/equipos
exports.getAllEquipos = async (req, res, next) => {
  try {
    const equipos = await Equipo.find({}, { id: 1, abreviatura: 1, pais: 1, confederacion: 1, _id: 0 });
    res.status(200).json({
      status: 'success',
      results: equipos.length,
      data: { equipos }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/equipos/:abbr
exports.getEquipoByAbbr = async (req, res, next) => {
  try {
    const equipo = await Equipo.findOne({ abreviatura: req.params.abbr.toLowerCase() });
    if (!equipo) {
      return res.status(404).json({
        status: 'fail',
        message: `No se encontró el equipo con abreviatura ${req.params.abbr}`
      });
    }
    const jugadores = await Jugador.find({ equipo: equipo.pais });
    res.status(200).json({
      status: 'success',
      data: { equipo, jugadores }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/equipos/:abbr/stats
exports.getEquipoStats = async (req, res, next) => {
  try {
    const equipo = await Equipo.findOne({ abreviatura: req.params.abbr.toLowerCase() });
    if (!equipo) {
      return res.status(404).json({ status: 'fail', message: 'Equipo no encontrado' });
    }

    const stats = await Jugador.aggregate([
      { $match: { equipo: equipo.pais } },
      {
        $group: {
          _id: '$equipo',
          totalJugadores: { $sum: 1 },
          estaturaPromedio: { $avg: '$estatura' },
          pesoPromedio: { $avg: '$peso' },
          masAlto: { $max: '$estatura' },
          masBajo: { $min: '$estatura' },
          posiciones: { $addToSet: '$posicion' }
        }
      },
      {
        $project: {
          _id: 0,
          equipo: '$_id',
          totalJugadores: 1,
          estaturaPromedio: { $round: ['$estaturaPromedio', 2] },
          pesoPromedio: { $round: ['$pesoPromedio', 2] },
          masAlto: 1,
          masBajo: 1,
          posiciones: 1
        }
      }
    ]);

    if (stats.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Sin jugadores para este equipo' });
    }

    res.status(200).json({
      status: 'success',
      data: { equipo: equipo.pais, stats: stats[0] }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/equipos
exports.createEquipo = async (req, res, next) => {
  try {
    const nuevoEquipo = await Equipo.create(req.body);
    res.status(201).json({ status: 'success', data: { equipo: nuevoEquipo } });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/equipos/:abbr
exports.updateEquipo = async (req, res, next) => {
  try {
    const equipo = await Equipo.findOneAndUpdate(
      { abreviatura: req.params.abbr.toLowerCase() },
      req.body,
      { new: true, runValidators: true }
    );
    if (!equipo) {
      return res.status(404).json({ status: 'fail', message: 'Equipo no encontrado' });
    }
    res.status(200).json({ status: 'success', data: { equipo } });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/equipos/:abbr
exports.deleteEquipo = async (req, res, next) => {
  try {
    const equipo = await Equipo.findOneAndDelete({ abreviatura: req.params.abbr.toLowerCase() });
    if (!equipo) {
      return res.status(404).json({ status: 'fail', message: 'Equipo no encontrado' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};