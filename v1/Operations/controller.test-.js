const request = require('supertest');
const express = require('express');
const { create, update, delete: deleteOperation } = require('./controller');
const { authMiddleware } = require('../middleware/authMiddleware');
const sequelize = require('../config/db');

jest.mock('./service');
const { createOperation, updateOperation, deleteOperation: deleteOperationService } = require('./service');

const app = express();
app.use(express.json());
app.use(authMiddleware);
app.post('/api/v1/operations', create);
app.put('/api/v1/operations/:id', update);
app.delete('/api/v1/operations/:id', deleteOperation);

describe('Operation Controller', () => {
  beforeAll(() => sequelize.sync());
  afterEach(() => jest.clearAllMocks());

  describe('POST /api/v1/operations', () => {
    it('should create a new operation', async () => {
      const mockOperation = { type: 'addition', cost: 10.5 };
      createOperation.mockResolvedValue(mockOperation);

      const response = await request(app)
        .post('/api/v1/operations')
        .send(mockOperation)
        .set('Authorization', 'Bearer mocktoken');
        
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockOperation);
    });

    it('should return 400 if operation creation fails', async () => {
      createOperation.mockRejectedValue(new Error('Error creating operation'));

      const response = await request(app)
        .post('/api/v1/operations')
        .send({ type: 'addition', cost: 10.5 })
        .set('Authorization', 'Bearer mocktoken');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Error creating operation' });
    });
  });

  describe('PUT /api/v1/operations/:id', () => {
    it('should update an existing operation', async () => {
      const mockOperation = { id: 1, type: 'addition', cost: 10.5 };
      updateOperation.mockResolvedValue(mockOperation);

      const response = await request(app)
        .put(`/api/v1/operations/${mockOperation.id}`)
        .send({ type: mockOperation.type, cost: mockOperation.cost })
        .set('Authorization', 'Bearer mocktoken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOperation);
    });

    it('should return 404 if operation is not found', async () => {
      updateOperation.mockRejectedValue(new Error('Operation not found'));

      const response = await request(app)
        .put('/api/v1/operations/1')
        .send({ type: 'addition', cost: 10.5 })
        .set('Authorization', 'Bearer mocktoken');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Operation not found' });
    });

    it('should return 400 if operation update fails', async () => {
      updateOperation.mockRejectedValue(new Error('Error updating operation'));

      const response = await request(app)
        .put('/api/v1/operations/1')
        .send({ type: 'addition', cost: 10.5 })
        .set('Authorization', 'Bearer mocktoken');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Error updating operation' });
    });
  });

  describe('DELETE /api/v1/operations/:id', () => {
    it('should delete an existing operation', async () => {
      deleteOperationService.mockResolvedValue({ message: 'Operation deleted successfully' });

      const response = await request(app)
        .delete('/api/v1/operations/1')
        .set('Authorization', 'Bearer mocktoken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Operation deleted successfully' });
    });

    it('should return 404 if operation is not found', async () => {
      deleteOperationService.mockRejectedValue(new Error('Operation not found'));

      const response = await request(app)
        .delete('/api/v1/operations/1')
        .set('Authorization', 'Bearer mocktoken');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Operation not found' });
    });

    it('should return 500 if operation deletion fails', async () => {
      deleteOperationService.mockRejectedValue(new Error('Error deleting operation'));

      const response = await request(app)
        .delete('/api/v1/operations/1')
        .set('Authorization', 'Bearer mocktoken');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error deleting operation' });
    });
  });
});
