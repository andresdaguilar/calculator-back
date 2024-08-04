const { Op } = require('sequelize');
const Record = require('./RecordModel');
const Operation = require('../Operations/OperationModel');
const {
  createRecord,
  getRecords,
  getRecordById,
  deleteRecord
} = require('./service');
const { findOne: findUser, updateBalance } = require('../Users/service');
const { findOne: findOperation } = require('../Operations/service');
const { filterConditions, executeOperation } = require('./helpers');

jest.mock('../Users/service');
jest.mock('../Operations/service');
jest.mock('./RecordModel');
jest.mock('./helpers');

describe('Record Service', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRecord', () => {
    it('should create a new record if user has enough balance', async () => {
      const user = { id: 1, balance: 100 };
      const operation = { id: 1, type: 'addition', cost: 10 };
      const result = 20;

      findUser.mockResolvedValue(user);
      findOperation.mockResolvedValue(operation);
      executeOperation.mockResolvedValue(result);
      updateBalance.mockResolvedValue();
      Record.create.mockResolvedValue({ id: 1 });

      const newRecord = await createRecord(operation.id, 10, 10, user.id);

      expect(newRecord).toHaveProperty('operation_id', operation.id);
      expect(newRecord).toHaveProperty('user_id', user.id);
      expect(newRecord).toHaveProperty('amount', 10);
      expect(newRecord).toHaveProperty('amount2', 10);
      expect(newRecord).toHaveProperty('user_balance', 90);
      expect(newRecord).toHaveProperty('operation_response', result);
    });

    it('should throw an error if user does not have enough balance', async () => {
      const user = { id: 1, balance: 5 };
      const operation = { id: 1, type: 'addition', cost: 10 };

      findUser.mockResolvedValue(user);
      findOperation.mockResolvedValue(operation);

      await expect(createRecord(operation.id, 10, 10, user.id)).rejects.toThrow('No enough credit');
    });
  });

  describe('getRecords', () => {
    it('should get records with filtering, sorting, and pagination', async () => {
      const query = { page: 1, size: 10, search: 'test', filter: 'amount:gt:10', sortField: 'amount', sortOrder: 'asc' };
      const userId = 1;
      const recordsData = {
        count: 2,
        rows: [
          { id: 1, amount: 20, amount2: 30, user_balance: 80, operation_response: 'success', operation: { type: 'addition', cost: 10 } },
          { id: 2, amount: 15, amount2: 25, user_balance: 75, operation_response: 'success', operation: { type: 'addition', cost: 10 } }
        ]
      };

      Record.findAndCountAll.mockResolvedValue(recordsData);
      filterConditions.mockReturnValue();

      const result = await getRecords(query, userId);

      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(1);
      expect(result.records).toHaveLength(2);
    });
  });

  describe('getRecordById', () => {
    it('should get a record by ID', async () => {
      const record = { id: 1, amount: 20 };

      Record.findByPk.mockResolvedValue(record);

      const result = await getRecordById(1);

      expect(result).toHaveProperty('id', 1);
    });

    it('should throw an error if record is not found', async () => {
      Record.findByPk.mockResolvedValue(null);

      await expect(getRecordById(1)).rejects.toThrow('Record not found');
    });
  });

  describe('deleteRecord', () => {
    it('should delete a record by ID', async () => {
      const record = { id: 1, destroy: jest.fn().mockResolvedValue() };

      Record.findByPk.mockResolvedValue(record);

      const result = await deleteRecord(1);

      expect(result).toHaveProperty('message', 'Record deleted successfully');
      expect(record.destroy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if record is not found', async () => {
      Record.findByPk.mockResolvedValue(null);

      await expect(deleteRecord(1)).rejects.toThrow('Record not found');
    });
  });
});
