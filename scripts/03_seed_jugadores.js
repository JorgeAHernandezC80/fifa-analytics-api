// node scripts/03_seed_jugadores.js
const { sembrar, leerDatos } = require('./lib/conexion');

(async () => {
  // Verificación previa: todos los jugadores deben pertenecer a un equipo existente
  const paises = new Set(leerDatos('equipos').map((e) => e.pais));
  const sinEquipo = [...new Set(leerDatos('jugadores').map((j) => j.equipo).filter((p) => !paises.has(p)))];
  if (sinEquipo.length) console.log(`⚠️  Equipos inexistentes referenciados por jugadores: ${sinEquipo.join(', ')}`);

  await sembrar('jugadores');
})().catch((error) => {
  console.error('\n❌ ERROR:', error.message);
  process.exit(1);
});
