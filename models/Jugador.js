const mongoose = require('mongoose');

const jugadorSchema = new mongoose.Schema({
  equipo: {
    type: String,
    required: [true, 'El equipo es obligatorio'],
    trim: true,
    index: true
  },
  numero: {
    type: Number,
    required: [true, 'El número es obligatorio'],
    min: 1,
    max: 23
  },
  posicion: {
    type: String,
    required: [true, 'La posición es obligatoria'],
    enum: {
      values: ['GK', 'CB', 'CM', 'CF', 'DF', 'MF', 'FW'],
      message: '{VALUE} no es una posición válida'
    },
    uppercase: true
  },
  nombreFifa: {
    type: String,
    required: [true, 'El nombre FIFA es obligatorio'],
    trim: true
  },
  fechaNacimiento: {
    type: String,
    trim: true
  },
  nombreCamiseta: {
    type: String,
    trim: true
  },
  club: {
    type: String,
    trim: true
  },
  estatura: {
    type: Number,
    min: 150,
    max: 220
  },
  peso: {
    type: Number,
    min: 50,
    max: 120
  }
}, {
  timestamps: true,
  collection: 'jugadores'
});

module.exports = mongoose.model('Jugador', jugadorSchema);