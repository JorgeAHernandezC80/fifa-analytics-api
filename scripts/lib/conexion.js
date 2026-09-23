// Utilidades compartidas por los scripts de base de datos.
require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const mongoose = require('mongoose');

const { EJSON } = mongoose.mongo.BSON;
const CARPETA_DATOS = path.join(__dirname, '..', '..', 'data');
const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mundial2018';

// Conecta y devuelve el objeto db nativo del driver de MongoDB.
async function conectar() {
  // Solo las URI de Atlas (mongodb+srv) necesitan resolver registros DNS SRV
  if (URI.startsWith('mongodb+srv://')) dns.setServers(['8.8.8.8', '8.8.4.4']);
  await mongoose.connect(URI, { serverSelectionTimeoutMS: 5000, autoIndex: false });
  const { host, name } = mongoose.connection;
  console.log(`✅ Conectado a ${host} | base de datos: ${name} | ${new Date().toLocaleString('es-CO')}`);
  return mongoose.connection.db;
}

async function desconectar() {
  await mongoose.disconnect();
}

// Lee data/<coleccion>.json (Extended JSON: conserva ObjectId y fechas)
function leerDatos(coleccion) {
  const archivo = path.join(CARPETA_DATOS, `${coleccion}.json`);
  if (!fs.existsSync(archivo)) {
    throw new Error(`No existe data/${coleccion}.json. Genera los datos con: npm run db:exportar`);
  }
  return EJSON.parse(fs.readFileSync(archivo, 'utf8'));
}

// Borra la colección (para poder repetir el script) e inserta los documentos.
async function sembrar(coleccion) {
  const db = await conectar();
  try {
    const docs = leerDatos(coleccion);
    const borrados = await db.collection(coleccion).deleteMany({});
    if (borrados.deletedCount) console.log(`🧹 ${coleccion}: ${borrados.deletedCount} documentos anteriores eliminados`);

    try {
      // ordered: false => si un documento falla, los demás se insertan igual
      const r = await db.collection(coleccion).insertMany(docs, { ordered: false });
      console.log(`📥 ${coleccion}: ${r.insertedCount} documentos insertados`);
    } catch (e) {
      const errores = e.writeErrors || [];
      console.log(`⚠️  ${coleccion}: ${docs.length - errores.length} insertados, ${errores.length} rechazados`);
      errores.slice(0, 3).forEach((we) => {
        const info = we.err || we;
        console.log(`   - código ${info.code}: ${info.errmsg}`);
        if (info.errInfo) console.log(`     ${JSON.stringify(info.errInfo.details || info.errInfo).slice(0, 400)}`);
      });
      process.exitCode = 1;
    }

    console.log(`🔢 Total en ${coleccion}: ${await db.collection(coleccion).countDocuments()}`);
    return db;
  } finally {
    await desconectar();
  }
}

module.exports = { conectar, desconectar, leerDatos, sembrar, EJSON, CARPETA_DATOS, URI };
