const mongoose = require('mongoose');

const partidoSchema = new mongoose.Schema({
  equipo1: {
    type: String,
    required: [true, 'El equipo 1 es obligatorio'],
    trim: true
  },
  equipo2: {
    type: String,
    required: [true, 'El equipo 2 es obligatorio'],
    trim: true
  },
  fecha: {
    type: String,
    required: [true, 'La fecha es obligatoria'],
    trim: true
  },
  hora: {
    type: String,
    required: [true, 'La hora es obligatoria'],
    trim: true
  }
}, {
  timestamps: true,
  collection: 'partidos'
});

module.exports = mongoose.model('Partido', partidoSchema);