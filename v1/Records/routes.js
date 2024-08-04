const express = require('express');
const {
  create,
  getAll,
  getOne,
  delete: deleteRecord
} = require('./controller');
const { authMiddleware } = require('../middleware/authMiddleware');
const { getRecordLimiter } = require('../middleware/rateLimit');

const { validateDTO, validateId } = require('../middleware/validateDTO');
const { idSchema, createRecordSchema, querySchema } = require('./recordDTO');

const router = express.Router();

const contentValidation = {
  BODY: "body",
  QUERY: "query"
}

router.get('/', authMiddleware, getRecordLimiter, validateDTO(querySchema, contentValidation.QUERY), getAll);
router.get('/:id', authMiddleware, validateId(idSchema), getOne);
router.post('/', authMiddleware, validateDTO(createRecordSchema), create);
router.delete('/:id', authMiddleware, validateId(idSchema), deleteRecord);

module.exports = router;
