const request = require('supertest');
const express = require('express');
const { register, login } = require('./controller');
const { registerUser, loginUser } = require('./service');

jest.mock('./service');

const app = express();
app.use(express.json());
app.post('/api/v1/users/register', register);
app.post('/api/v1/users/login', login);

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/users/register', () => {
    it('should register a new user', async () => {
      registerUser.mockResolvedValue({ email: 'test@example.com' });

      const response = await request(app)
        .post('/api/v1/users/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'User registered' });
      expect(registerUser).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should return 400 if registration fails', async () => {
      registerUser.mockRejectedValue(new Error('User already exists'));

      const response = await request(app)
        .post('/api/v1/users/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'User already exists' });
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('should log in an existing user with correct credentials', async () => {
      const mockUser = { id: 1, email: 'test@example.com', password: 'hashedpassword', status: 'active' };
      loginUser.mockResolvedValue({ user: mockUser, token: 'mocktoken' });

      const response = await request(app)
        .post('/api/v1/users/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ token: 'mocktoken' });
      expect(loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should return 400 if login fails', async () => {
      loginUser.mockRejectedValue(new Error('Invalid credentials'));

      const response = await request(app)
        .post('/api/v1/users/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Invalid credentials' });
    });
  });
});