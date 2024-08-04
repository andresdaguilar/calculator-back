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

/**
 * @swagger
 * components:
 *   schemas:
 *     Record:
 *       type: object
 *       required:
 *         - operation_id
 *         - amount
 *         - amount2
 *         - user_id
 *       properties:
 *         operation_id:
 *           type: integer
 *           description: The ID of the operation
 *         amount:
 *           type: number
 *           description: The first amount for the operation
 *         amount2:
 *           type: number
 *           description: The second amount for the operation (if applicable)
 *         user_id:
 *           type: integer
 *           description: The ID of the user
 *         user_balance:
 *           type: number
 *           description: The balance of the user after the operation
 *         operation_response:
 *           type: string
 *           description: The response of the operation
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date of the record
 */

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: Records management
 */

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Get all records
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: Page size
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for partial match
*       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filter options
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *         description: Order of sorting (asc or desc)
 *     responses:
 *       200:
 *         description: The list of records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Record'
 */
router.get('/', authMiddleware, getRecordLimiter, validateDTO(querySchema, contentValidation.QUERY), getAll);

/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: Get a record by ID
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The record ID
 *     responses:
 *       200:
 *         description: The record data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Record'
 *       404:
 *         description: Record not found
 */
router.get('/:id', authMiddleware, validateId(idSchema), getOne);

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Create a new record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Record'
 *     responses:
 *       201:
 *         description: The record was successfully created
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, validateDTO(createRecordSchema, contentValidation.BODY), create);

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Delete a record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The record ID
 *     responses:
 *       200:
 *         description: The record was successfully deleted
 *       404:
 *         description: Record not found
 */
router.delete('/:id', authMiddleware, validateId(idSchema), deleteRecord);

module.exports = router;