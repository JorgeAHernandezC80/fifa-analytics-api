const Partido = require('../models/Partido');

// GET /api/partidos
exports.getAllPartidos = async (req, res, next) => {
  try {
    const partidos = await Partido.find().sort({ fecha: 1 });
    res.status(200).json({
      status: 'success',
      results: partidos.length,
      data: { partidos }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/partidos/:id
exports.getPartidoById = async (req, res, next) => {
  try {
    const partido = await Partido.findById(req.params.id);
    if (!partido) {
      return res.status(404).json({ status: 'fail', message: 'Partido no encontrado' });
    }
    res.status(200).json({ status: 'success', data: { partido } });
  } catch (error) {
    next(error);
  }
};

// GET /api/partidos/equipo/:equipo
exports.getPartidosByEquipo = async (req, res, next) => {
  try {
    const partidos = await Partido.find({
      $or: [{ equipo1: req.params.equipo }, { equipo2: req.params.equipo }]
    }).sort({ fecha: 1 });
    res.status(200).json({
      status: 'success',
      results: partidos.length,
      data: { partidos }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/partidos
exports.createPartido = async (req, res, next) => {
  try {
    const nuevoPartido = await Partido.create(req.body);
    res.status(201).json({ status: 'success', data: { partido: nuevoPartido } });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/partidos/:id
exports.updatePartido = async (req, res, next) => {
  try {
    const partido = await Partido.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!partido) {
      return res.status(404).json({ status: 'fail', message: 'Partido no encontrado' });
    }
    res.status(200).json({ status: 'success', data: { partido } });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/partidos/:id
exports.deletePartido = async (req, res, next) => {
  try {
    const partido = await Partido.findByIdAndDelete(req.params.id);
    if (!partido) {
      return res.status(404).json({ status: 'fail', message: 'Partido no encontrado' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};