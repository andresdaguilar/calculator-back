const express = require('express');
const {
  register,
  login,
  updateBalance
} = require('./controller');
const router = express.Router();
const { validateDTO } = require('../middleware/validateDTO');
const { registerUser, updateBalanceDTO } = require('./userDTO');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *     UpdateBalance:
 *       type: object
 *       required:
 *         - user_id
 *         - new_balance
 *       properties:
 *         user_id:
 *           type: integer
 *           description: The user's ID
 *           example: 1
 *         new_balance:
 *           type: number
 *           description: The new balance for the user
 *           example: 100.50
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', validateDTO(registerUser), register);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/v1/users/update-balance:
 *   patch:
 *     summary: Update the balance of a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBalance'
 *     responses:
 *       200:
 *         description: User balance updated successfully
 *       400:
 *         description: Bad request
 */
router.patch('/update-balance', validateDTO(updateBalanceDTO), updateBalance)

module.exports = router;