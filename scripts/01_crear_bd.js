// node scripts/01_crear_bd.js
const { conectar, desconectar, leerDatos } = require('./lib/conexion');

const NUMERO = ['int', 'long', 'double', 'decimal'];
const NUMERO_O_NULL = [...NUMERO, 'null'];
const TEXTO_O_NULL = ['string', 'null'];
const FECHA = { bsonType: 'date' };

const colecciones = {
  equipos: {
    bsonType: 'object',
    title: 'Equipo',
    required: ['id', 'abreviatura', 'pais', 'confederacion'],
    properties: {
      _id: { bsonType: 'objectId' },
      id: { bsonType: NUMERO, minimum: 1, description: 'ID numérico del equipo' },
      abreviatura: { bsonType: 'string', minLength: 3, maxLength: 3, description: 'Código FIFA de 3 letras' },
      pais: { bsonType: 'string', minLength: 2 },
      confederacion: { enum: ['CONMEBOL', 'UEFA', 'CONCACAF', 'CAF', 'AFC', 'OFC'] },
      createdAt: FECHA,
      updatedAt: FECHA,
      __v: { bsonType: NUMERO }
    }
  },
  jugadores: {
    bsonType: 'object',
    title: 'Jugador',
    required: ['equipo', 'numero', 'posicion', 'nombreFifa'],
    properties: {
      _id: { bsonType: 'objectId' },
      equipo: { bsonType: 'string', description: 'Nombre del país (equipos.pais)' },
      numero: { bsonType: NUMERO, minimum: 1, maximum: 23, multipleOf: 1 },
      posicion: { enum: ['GK', 'CB', 'CM', 'CF', 'DF', 'MF', 'FW'] },
      nombreFifa: { bsonType: 'string', minLength: 1 },
      fechaNacimiento: { bsonType: TEXTO_O_NULL },
      nombreCamiseta: { bsonType: TEXTO_O_NULL },
      club: { bsonType: TEXTO_O_NULL },
      estatura: { bsonType: NUMERO_O_NULL, minimum: 150, maximum: 220, description: 'cm' },
      peso: { bsonType: NUMERO_O_NULL, minimum: 50, maximum: 120, description: 'kg' },
      createdAt: FECHA,
      updatedAt: FECHA,
      __v: { bsonType: NUMERO }
    }
  },
  partidos: {
    bsonType: 'object',
    title: 'Partido',
    required: ['equipo1', 'equipo2', 'fecha', 'hora'],
    properties: {
      _id: { bsonType: 'objectId' },
      equipo1: { bsonType: 'string' },
      equipo2: { bsonType: 'string' },
      fecha: { bsonType: 'string' },
      hora: { bsonType: 'string' },
      createdAt: FECHA,
      updatedAt: FECHA,
      __v: { bsonType: NUMERO }
    }
  }
};

// Se usan los nombres de índice por defecto (ej. "id_1") para que coincidan
// con los que Mongoose crea desde los modelos y no haya conflicto.
const indices = {
  equipos: [
    [{ id: 1 }, { unique: true }],
    [{ abreviatura: 1 }, { unique: true }],
    [{ pais: 1 }, { unique: true }]          // llave con la que se relacionan jugadores y partidos
  ],
  jugadores: [
    [{ equipo: 1 }, {}],
    [{ equipo: 1, numero: 1 }, { unique: true }],
    [{ posicion: 1, estatura: -1 }, {}]       // filtros por posición y estatura de GET /api/jugadores
  ],
  partidos: [
    [{ equipo1: 1 }, {}], 
    [{ equipo2: 1 }, {}],
    [{ fecha: 1 }, {}]
  ]
};

(async () => {
  try {
    // Protección: este script BORRA las colecciones. Antes de hacerlo se
    // comprueba que existan los datos de data/ para poder volver a cargarlos.
    ['equipos', 'jugadores', 'partidos'].forEach(leerDatos);

    const db = await conectar();
    const existentes = (await db.listCollections().toArray()).map((c) => c.name);

    for (const [nombre, esquema] of Object.entries(colecciones)) {
      if (existentes.includes(nombre)) {
        await db.collection(nombre).drop();
        console.log(`🗑️  Colección eliminada: ${nombre}`);
      }
      await db.createCollection(nombre, {
        validator: { $jsonSchema: esquema },
        validationLevel: 'strict',  // valida inserciones y actualizaciones
        validationAction: 'error'   // rechaza el documento inválido
      });
      for (const [campos, opciones] of indices[nombre]) {
        await db.collection(nombre).createIndex(campos, opciones);
      }
      const nombresIndices = (await db.collection(nombre).indexes()).map((i) => i.name).join(', ');
      console.log(`📁 Colección creada: ${nombre} | índices: ${nombresIndices}`);
    }

    console.log('\n✅ Esquema listo. Siguiente paso: node scripts/02_seed_equipos.js');
    await desconectar();
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  }
})();
