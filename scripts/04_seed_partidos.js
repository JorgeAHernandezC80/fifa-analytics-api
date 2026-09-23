// node scripts/04_seed_partidos.js
const { sembrar, conectar, desconectar } = require('./lib/conexion');

(async () => {
  await sembrar('partidos');

  const db = await conectar();
  console.log('\n📊 Resumen de la base de datos');
  for (const c of ['equipos', 'jugadores', 'partidos']) {
    console.log(`   ${c.padEnd(10)} ${await db.collection(c).countDocuments()} documentos`);
  }
  await desconectar();
  console.log('\n✅ Base de datos lista. Ya puedes ejecutar: npm run dev');
})().catch((error) => {
  console.error('\n❌ ERROR:', error.message);
  process.exit(1);
});
