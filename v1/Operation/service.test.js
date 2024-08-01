const { createOperation, updateOperation, deleteOperation } = require('./service');
const Operation = require('./OperationModel');

jest.mock('./OperationModel');

describe('Operation Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOperation', () => {
    it('should create a new operation', async () => {
      const mockOperation = { type: 'addition', cost: 10.5 };
      Operation.create.mockResolvedValue(mockOperation);

      const result = await createOperation(mockOperation.type, mockOperation.cost);
      expect(result).toEqual(mockOperation);
      expect(Operation.create).toHaveBeenCalledWith(mockOperation);
    });

    it('should throw an error if operation creation fails', async () => {
      const mockOperation = { type: 'addition', cost: 10.5 };
      Operation.create.mockRejectedValue(new Error('Error creating operation'));

      await expect(createOperation(mockOperation.type, mockOperation.cost)).rejects.toThrow('Error creating operation: Error creating operation');
    });
  });

  describe('updateOperation', () => {
    it('should update an existing operation', async () => {
      const mockOperation = { id: 1, type: 'addition', cost: 10.5 };
      Operation.findByPk.mockResolvedValue(mockOperation);
      mockOperation.save = jest.fn().mockResolvedValue(mockOperation);

      const result = await updateOperation(mockOperation.id, mockOperation.type, mockOperation.cost);
      expect(result).toEqual(mockOperation);
      expect(Operation.findByPk).toHaveBeenCalledWith(mockOperation.id);
      expect(mockOperation.save).toHaveBeenCalled();
    });

    it('should throw an error if operation is not found', async () => {
      Operation.findByPk.mockResolvedValue(null);

      await expect(updateOperation(1, 'addition', 10.5)).rejects.toThrow('Operation not found');
    });

    it('should throw an error if operation update fails', async () => {
      const mockOperation = { id: 1, type: 'addition', cost: 10.5 };
      Operation.findByPk.mockResolvedValue(mockOperation);
      mockOperation.save = jest.fn().mockRejectedValue(new Error('Error updating operation'));

      await expect(updateOperation(mockOperation.id, mockOperation.type, mockOperation.cost)).rejects.toThrow('Error updating operation: Error updating operation');
    });
  });

  describe('deleteOperation', () => {
    it('should delete an existing operation', async () => {
      const mockOperation = { id: 1, destroy: jest.fn().mockResolvedValue() };
      Operation.findByPk.mockResolvedValue(mockOperation);

      const result = await deleteOperation(mockOperation.id);
      expect(result).toEqual({ message: 'Operation deleted successfully' });
      expect(Operation.findByPk).toHaveBeenCalledWith(mockOperation.id);
      expect(mockOperation.destroy).toHaveBeenCalled();
    });

    it('should throw an error if operation is not found', async () => {
      Operation.findByPk.mockResolvedValue(null);

      await expect(deleteOperation(1)).rejects.toThrow('Operation not found');
    });

    it('should throw an error if operation deletion fails', async () => {
      const mockOperation = { id: 1, destroy: jest.fn().mockRejectedValue(new Error('Error deleting operation')) };
      Operation.findByPk.mockResolvedValue(mockOperation);

      await expect(deleteOperation(mockOperation.id)).rejects.toThrow('Error deleting operation: Error deleting operation');
    });
  });
});