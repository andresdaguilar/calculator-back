const Record = require('./RecordModel');
const Operation = require('../Operations/OperationModel');

const { Op } = require('sequelize');
const { findOne: findUser, updateBalance} = require('../Users/service');
const { findOne: findOperation} = require('../Operations/service');
const { filterConditions, executeOperation, getRandomString } = require('./helpers.js');

exports.createRecord = async (operation_id, amount, amount2, userId) => {
  try{
    const [user, operation] = await Promise.all([
      findUser(userId),
      findOperation(operation_id)
    ]);
    let { balance: userBalance } = user;
    userBalance = parseFloat(userBalance);
    const { cost, type } = operation;
    const operationCost = parseFloat(cost);
    if (userBalance >= cost){    
      const result = await executeOperation(operation.type, amount, amount2);
      console.log(result);
      const newBalance = userBalance - cost;

      await updateBalance(userId, newBalance)
      const newRecord = {
        operation_id,
        user_id: userId,
        amount,
        amount2,
        user_balance: newBalance,
        operation_response: result        
      }
      await Record.create(newRecord);
      return newRecord;
    }else{
      throw new Error("No enough credit");
    }
    
  } catch (error) {
    console.log(error);    
    throw error;
  }
  
};

exports.getRecords = async (query, userId) => {
  const { page = 1, size = 10, search, filter, sortField, sortOrder } = query;
  const offset = (page - 1) * size;
  const where = { user_id: userId };
  const operationWhere = {};
  const filterableFields = ['amount', 'amount2', 'operation_response', 'user_balance', 'date'];

  if (search) {
    where.operation_response = { [Op.like]: `%${search}%` };
  }

  if (filter) {
    filterConditions(filter, where, operationWhere, filterableFields);
  }

  try {
    const records = await Record.findAndCountAll({
      where,
      include: [{
        model: Operation,
        as: 'operation',
        where: operationWhere,
        attributes: ['type', 'cost'],
      }],
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      limit: size,
      offset,
      order: sortField && sortOrder ? [[sortField, sortOrder.toUpperCase()]] : [],
    });
    return {
      totalPages: Math.ceil(records.count / size),
      currentPage: page,
      records: records.rows,
    };
  } catch (error) {
    throw new Error('Error fetching records: ' + error.message);
  }
};

exports.getRecordById = async (id) => {
  try {
    const record = await Record.findByPk(id);
    if (!record) {
      throw new Error('Record not found');
    }
    return record;
  } catch (error) {
    throw new Error('Error fetching record: ' + error.message);
  }
};

exports.deleteRecord = async (id) => {
  try {
    const record = await Record.findByPk(id);
    if (!record) {
      throw new Error('Record not found');
    }
    await record.destroy();
    return { message: 'Record deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting record: ' + error.message);
  }
};


  