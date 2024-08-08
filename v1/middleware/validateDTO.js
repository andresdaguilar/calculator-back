const validateDTO = (schema, content) => (req, res, next) => {
  console.log("Content", content)
  const { error } = schema.validate(req[content], { abortEarly: false });
  if (error) {
    return res.status(400).json(
      {
        message: 'Validation error',
        details: error.details.map((detail) => detail.message),
      }
    );
  }
  console.log("Validation", error)
  next();
};

const validateId = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params.id);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

module.exports = {
  validateDTO,
  validateId
}
