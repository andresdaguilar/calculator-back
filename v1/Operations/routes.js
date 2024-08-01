const express = require('express');
const {
  create,
  update,
  delete: deleteOperation
} = require('./controller');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Operation:
 *       type: object
 *       required:
 *         - type
 *         - cost
 *       properties:
 *         type:
 *           type: string
 *           description: The operation type
 *           enum: [addition, subtraction, multiplication, division, square_root, random_string]
 *         cost:
 *           type: number
 *           description: The cost of the operation
 */

/**
 * @swagger
 * tags:
 *   name: Operations
 *   description: Operations management
 */

/**
 * @swagger
 * /api/v1/operations:
 *   post:
 *     summary: Create a new operation
 *     tags: [Operations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Operation'
 *     responses:
 *       201:
 *         description: The operation was successfully created
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, create);

/**
 * @swagger
 * /api/v1/operations/{id}:
 *   patch:
 *     summary: Update an existing operation
 *     tags: [Operations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The operation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Operation'
 *     responses:
 *       200:
 *         description: The operation was successfully updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Operation not found
 */
router.patch('/:id', authMiddleware, update);

/**
 * @swagger
 * /api/v1/operations/{id}:
 *   delete:
 *     summary: Delete an operation
 *     tags: [Operations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The operation ID
 *     responses:
 *       200:
 *         description: The operation was successfully deleted
 *       404:
 *         description: Operation not found
 */
router.delete('/:id', authMiddleware, deleteOperation);

module.exports = router;