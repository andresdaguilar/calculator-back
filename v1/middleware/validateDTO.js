const validateDTO = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    console.log(error.details)
    return res.status(400).json(
      {
        message: 'Validation error',
        details: error.details.map((detail) => detail.message),
      }
    );
  }
  next();
};

module.exports = validateDTO;