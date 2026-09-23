// Middleware de errores: traduce cada error al código HTTP correcto
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const responder = (statusCode, message, extra = {}) =>
    res.status(statusCode).json({
      status: statusCode < 500 ? 'fail' : 'error',
      message,
      ...extra
    });

  // Body con JSON mal escrito
  if (err.type === 'entity.parse.failed') {
    return responder(400, 'El cuerpo de la petición no es un JSON válido');
  }

  // Un valor no se pudo convertir al tipo esperado (ej. un _id mal formado)
  if (err.name === 'CastError') {
    return responder(400, `Valor inválido para "${err.path}": ${JSON.stringify(err.value)}`);
  }

  // Falló una validación del modelo (campo obligatorio, enum, min, max...)
  if (err.name === 'ValidationError') {
    const errores = Object.values(err.errors).map((e) => ({ campo: e.path, mensaje: e.message }));
    return responder(422, 'Datos inválidos', { errores });
  }

  // Índice único violado (id, abreviatura o número repetido en un equipo)
  if (err.code === 11000) {
    const campos = Object.keys(err.keyValue || {}).join(', ') || 'desconocido';
    return responder(409, `Ya existe un registro con el mismo valor en: ${campos}`);
  }

  // El validador $jsonSchema de la colección rechazó el documento
  if (err.code === 121) {
    return responder(422, 'El documento no cumple el esquema definido en la base de datos');
  }

  // Errores lanzados a propósito con un statusCode
  if (err.statusCode) {
    return responder(err.statusCode, err.message);
  }

  console.error(`[${new Date().toISOString()}] Error:`, err);
  return responder(500, 'Error interno del servidor');
};

// Middleware 404: rutas que no existen
const notFound = (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
};

module.exports = { errorHandler, notFound };
