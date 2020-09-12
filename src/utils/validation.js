const ValidationException = require('../exceptions/ValidationException');

/**
 * @param schema
 * @param object
 */
function validateSchema(schema, object) {
  const result = schema.validate(object, { stripUnknown: true });

  if (result.error) {
    throw new ValidationException(result.error.message);
  }
}

module.exports = validateSchema;
