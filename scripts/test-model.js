require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const Equipo = require('../models/Equipo');

const testModel = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado');

    // 1. Crear un equipo de prueba
    const nuevoEquipo = await Equipo.create({
      abbreviation: 'ARG',
      country: 'Argentina',
      confederation: 'CONMEBOL',
      squad: [
        {
          fifaName: 'MESSI Lionel',
          shirtNumber: 10,
          position: 'CF',
          club: 'FC Barcelona (ESP)',
          height: 170,
          weight: 72
        },
        {
          fifaName: 'AGUERO Sergio',
          shirtNumber: 19,
          position: 'CF',
          club: 'Manchester City FC (ENG)',
          height: 172,
          weight: 74
        }
      ]
    });

    console.log('✅ Equipo creado:', nuevoEquipo._id);

    // 2. Consultar el equipo
    const equipo = await Equipo.findOne({ abbreviation: 'ARG' });
    console.log('📋 Equipo encontrado:', equipo.country);
    console.log('👥 Jugadores en plantilla:', equipo.squad.length);
    console.log('⭐ Jugador estrella:', equipo.squad[0].fifaName);

    // 3. Limpiar (borrar el equipo de prueba)
    await Equipo.deleteOne({ abbreviation: 'ARG' });
    console.log('🗑️  Equipo de prueba eliminado');

    await mongoose.disconnect();
    console.log('✅ Desconectado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.name === 'ValidationError') {
      Object.keys(error.errors).forEach(key => {
        console.error(`   Campo "${key}": ${error.errors[key].message}`);
      });
    }
    process.exit(1);
  }
};

testModel();