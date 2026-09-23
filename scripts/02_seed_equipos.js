// node scripts/02_seed_equipos.js
const { sembrar } = require('./lib/conexion');

sembrar('equipos').catch((error) => {
  console.error('\n❌ ERROR:', error.message);
  process.exit(1);
});
