const express = require('express');
const {
  create,
  getAll,
  getOne,
  update,
  delete: deleteRecord
} = require('./controller');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Record:
 *       type: object
 *       required:
 *         - operation_id
 *         - user_id
 *         - amount
 *         - user_balance
 *         - operation_response
 *       properties:
 *         operation_id:
 *           type: integer
 *           description: The ID of the operation
 *         user_id:
 *           type: integer
 *           description: The ID of the user
 *         amount:
 *           type: number
 *           description: The amount of the operation
 *         user_balance:
 *           type: number
 *           description: The user balance after the operation
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
 * /api/v1/records:
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
 *         description: Filter criteria
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
router.get('/', authMiddleware, getAll);

/**
 * @swagger
 * /api/v1/records/{id}:
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
router.get('/:id', authMiddleware, getOne);

/**
 * @swagger
 * /api/v1/records:
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
router.post('/', authMiddleware, create);

/**
 * @swagger
 * /api/v1/records/{id}:
 *   patch:
 *     summary: Update a record
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Record'
 *     responses:
 *       200:
 *         description: The record was successfully updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Record not found
 */
router.patch('/:id', authMiddleware, update);

/**
 * @swagger
 * /api/v1/records/{id}:
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
router.delete('/:id', authMiddleware, deleteRecord);

module.exports = router;
