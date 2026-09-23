const mongoose = require('mongoose');

const equipoSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, 'El ID es obligatorio'],
    unique: true
  },
  abreviatura: {
    type: String,
    required: [true, 'La abreviatura es obligatoria'],
    minLength: [3, 'Debe tener 3 caracteres'],
    maxLength: [3, 'Debe tener 3 caracteres'],
    lowercase: true,
    trim: true
  },
  pais: {
    type: String,
    required: [true, 'El país es obligatorio'],
    trim: true
  },
  confederacion: {
    type: String,
    required: [true, 'La confederación es obligatoria'],
    enum: {
      values: ['CONMEBOL', 'UEFA', 'CONCACAF', 'CAF', 'AFC', 'OFC'],
      message: '{VALUE} no es una confederación válida'
    }
  }
}, {
  timestamps: true,
  collection: 'equipos'
});

module.exports = mongoose.model('Equipo', equipoSchema);