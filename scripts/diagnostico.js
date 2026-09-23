require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

const diagnostico = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('\n========== DIAGNÓSTICO ==========');
    console.log('🔌 Host:', conn.connection.host);
    console.log('📦 Base de datos (según Mongoose):', conn.connection.name);
    console.log('');

    // Listar TODAS las bases de datos visibles
    const admin = conn.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('🗄️  Bases de datos visibles:');
    dbs.databases.forEach(d => console.log(`   - ${d.name}`));
    console.log('');

    // Listar colecciones en la BD actual
    const colecciones = await conn.connection.db.listCollections().toArray();
    console.log(`📚 Colecciones en "${conn.connection.name}":`);
    if (colecciones.length === 0) {
      console.log('   (ninguna)');
    }
    for (const col of colecciones) {
      const count = await conn.connection.db.collection(col.name).countDocuments();
      console.log(`   - ${col.name}: ${count} documentos`);
    }
    console.log('');

    // Leer directo sin Mongoose
    console.log('📄 Muestra cruda de "equipos" (sin Mongoose):');
    const muestraEquipos = await conn.connection.db.collection('equipos').find({}).limit(2).toArray();
    console.log(JSON.stringify(muestraEquipos, null, 2));
    console.log('');

    console.log('📄 Muestra cruda de "jugadores" (sin Mongoose):');
    const muestraJugadores = await conn.connection.db.collection('jugadores').find({}).limit(1).toArray();
    console.log(JSON.stringify(muestraJugadores, null, 2));
    console.log('');

    // Ahora sí, con Mongoose
    const Equipo = require('../models/Equipo');
    console.log('🔍 Modelo Equipo según Mongoose:');
    console.log('   - Colección que usa:', Equipo.collection.name);
    console.log('   - Campos del schema:', Object.keys(Equipo.schema.paths));
    const countMongoose = await Equipo.countDocuments();
    console.log('   - Documentos encontrados por Mongoose:', countMongoose);
    console.log('');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  }
};

diagnostico();