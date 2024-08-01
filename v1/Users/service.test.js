const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./UserModel');
const { registerUser, loginUser } = require('./service');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('./UserModel');

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const mockUser = { id: 1, email: 'test@example.com', password: 'hashedpassword' };
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpassword');
      User.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mocktoken');

      const result = await registerUser('test@example.com', 'password123');

      expect(result).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(User.create).toHaveBeenCalledWith({ email: 'test@example.com', password: 'hashedpassword' });
      expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser.id }, process.env.JWT_SECRET, { expiresIn: '1w' });
    });

    it('should throw an error if user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      await expect(registerUser('test@example.com', 'password123')).rejects.toThrow('User already exists');
    });
  });

  describe('loginUser', () => {
    it('should log in an existing user with correct credentials', async () => {
      const mockUser = { id: 1, email: 'test@example.com', password: 'hashedpassword', status: 'active' };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mocktoken');

      const result = await loginUser('test@example.com', 'password123');

      expect(result).toEqual({ user: mockUser, token: 'mocktoken' });
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    it('should throw an error if user does not exist', async () => {
      User.findOne.mockResolvedValue(null);

      await expect(loginUser('test@example.com', 'password123')).rejects.toThrow('Invalid credentials');
    });

    it('should throw an error if password does not match', async () => {
      const mockUser = { id: 1, email: 'test@example.com', password: 'hashedpassword' };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(loginUser('test@example.com', 'password123')).rejects.toThrow('Invalid credentials');
    });

    it('should throw an error if user status is not active', async () => {
      const mockUser = { id: 1, email: 'test@example.com', password: 'hashedpassword', status: 'inactive' };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await expect(loginUser('test@example.com', 'password123')).rejects.toThrow('User inactive');
    });
  });
});