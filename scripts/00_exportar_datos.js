// npm run db:exportar
const fs = require('fs');
const path = require('path');
const { conectar, desconectar, EJSON, CARPETA_DATOS } = require('./lib/conexion');

// Distribución real de las 32 selecciones del Mundial Rusia 2018
const ESPERADO_2018 = { UEFA: 14, CONMEBOL: 5, CAF: 5, AFC: 5, CONCACAF: 3, OFC: 0 };

(async () => {
  try {
    const db = await conectar();
    fs.mkdirSync(CARPETA_DATOS, { recursive: true });

    const datos = {};
    for (const coleccion of ['equipos', 'jugadores', 'partidos']) {
      datos[coleccion] = await db.collection(coleccion).find({}).sort({ _id: 1 }).toArray();
      fs.writeFileSync(
        path.join(CARPETA_DATOS, `${coleccion}.json`),
        EJSON.stringify(datos[coleccion], null, 2, { relaxed: true })
      );
      console.log(`📄 ${coleccion}: ${datos[coleccion].length} documentos -> data/${coleccion}.json`);
    }

    console.log('\n🔎 Revisión de calidad');
    const { equipos, jugadores, partidos } = datos;

    // 1. Equipos por confederación comparados con el Mundial real
    const conteo = {};
    equipos.forEach((e) => { conteo[e.confederacion] = (conteo[e.confederacion] || 0) + 1; });
    console.log('   Equipos por confederación (encontrado / esperado 2018):');
    Object.entries(ESPERADO_2018).forEach(([conf, esperado]) => {
      const real = conteo[conf] || 0;
      console.log(`     ${real === esperado ? '✅' : '❌'} ${conf.padEnd(9)} ${real} / ${esperado}`);
    });

    // 2. Duplicados que romperían los índices únicos de 01_crear_bd.js
    const repetidos = (lista, clave) => {
      const vistos = {};
      lista.forEach((x) => { const k = clave(x); vistos[k] = (vistos[k] || 0) + 1; });
      return Object.keys(vistos).filter((k) => vistos[k] > 1);
    };
    const avisar = (texto, lista) =>
      console.log(`   ${lista.length ? '❌' : '✅'} ${texto}: ${lista.length ? lista.slice(0, 5).join(', ') : 'ninguno'}`);

    avisar('id de equipo repetido', repetidos(equipos, (e) => e.id));
    avisar('Abreviatura repetida', repetidos(equipos, (e) => String(e.abreviatura).toLowerCase()));
    avisar('Abreviatura con mayúsculas (el modelo guarda minúsculas)', equipos.filter((e) => e.abreviatura !== String(e.abreviatura).toLowerCase()).map((e) => e.abreviatura));
    avisar('Número de camiseta repetido en un equipo', repetidos(jugadores, (j) => `${j.equipo} #${j.numero}`));

    // 3. Relaciones por nombre de país
    const paises = new Set(equipos.map((e) => e.pais));
    avisar('Jugadores cuyo equipo no existe en equipos.pais', [...new Set(jugadores.filter((j) => !paises.has(j.equipo)).map((j) => j.equipo))]);
    avisar('Nombres de equipo en partidos que no existen en equipos.pais', [...new Set(partidos.flatMap((p) => [p.equipo1, p.equipo2]).filter((n) => !paises.has(n)))]);

    // 4. Resumen para el informe
    const porEquipo = {};
    jugadores.forEach((j) => { porEquipo[j.equipo] = (porEquipo[j.equipo] || 0) + 1; });
    console.log('\n📊 Cifras para el informe');
    console.log(`   Equipos: ${equipos.length} | Jugadores: ${jugadores.length} | Partidos: ${partidos.length}`);
    console.log(`   Jugadores por equipo: ${Object.entries(porEquipo).map(([k, v]) => `${k} ${v}`).join(', ')}`);

    await desconectar();
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  }
})();
