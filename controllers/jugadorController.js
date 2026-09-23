const Jugador = require('../models/Jugador');

// GET /api/jugadores - Listar todos los jugadores con filtros opcionales
exports.getAllJugadores = async (req, res, next) => {
  try {
    const filtro = {};
    if (req.query.equipo) filtro.equipo = req.query.equipo;
    if (req.query.posicion) filtro.posicion = req.query.posicion.toUpperCase();
    if (req.query.estaturaMax) filtro.estatura = { $lt: Number(req.query.estaturaMax) };
    if (req.query.estaturaMin) filtro.estatura = { ...filtro.estatura, $gt: Number(req.query.estaturaMin) };

    const jugadores = await Jugador.find(filtro).sort({ equipo: 1, numero: 1 });
    res.status(200).json({
      status: 'success',
      results: jugadores.length,
      data: { jugadores }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/jugadores/:id - Obtener un jugador por _id
exports.getJugadorById = async (req, res, next) => {
  try {
    const jugador = await Jugador.findById(req.params.id);
    if (!jugador) {
      return res.status(404).json({ status: 'fail', message: 'Jugador no encontrado' });
    }
    res.status(200).json({ status: 'success', data: { jugador } });
  } catch (error) {
    next(error);
  }
};

// GET /api/jugadores/equipo/:equipo - Jugadores de un equipo específico
exports.getJugadoresByEquipo = async (req, res, next) => {
  try {
    const jugadores = await Jugador.find({ equipo: req.params.equipo }).sort({ numero: 1 });
    res.status(200).json({
      status: 'success',
      results: jugadores.length,
      data: { jugadores }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/jugadores/stats/:equipo - Estadísticas de los jugadores de un equipo
exports.getEstadisticasJugadores = async (req, res, next) => {
  try {
    const stats = await Jugador.aggregate([
      { $match: { equipo: req.params.equipo } },
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
      return res.status(404).json({ status: 'fail', message: 'Sin datos para ese equipo' });
    }

    res.status(200).json({ status: 'success', data: { stats: stats[0] } });
  } catch (error) {
    next(error);
  }
};

// POST /api/jugadores - Crear un jugador
exports.createJugador = async (req, res, next) => {
  try {
    const nuevoJugador = await Jugador.create(req.body);
    res.status(201).json({ status: 'success', data: { jugador: nuevoJugador } });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/jugadores/:id - Actualizar un jugador
exports.updateJugador = async (req, res, next) => {
  try {
    const jugador = await Jugador.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!jugador) {
      return res.status(404).json({ status: 'fail', message: 'Jugador no encontrado' });
    }
    res.status(200).json({ status: 'success', data: { jugador } });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/jugadores/:id - Eliminar un jugador
exports.deleteJugador = async (req, res, next) => {
  try {
    const jugador = await Jugador.findByIdAndDelete(req.params.id);
    if (!jugador) {
      return res.status(404).json({ status: 'fail', message: 'Jugador no encontrado' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};