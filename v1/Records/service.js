const Record = require('./RecordModel');
const { Op } = require('sequelize');
const OperationType = require('./operationType.enum');
const { findOne: findUser, updateBalance} = require('../Users/service');
const { findOne: findOperation} = require('../Operations/service');

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
      Record.create(newRecord);
      return newRecord;
    }else{
      throw new Error("No enough credit");
    }
    
  } catch (error) {
    console.log(error);    
    throw error;
  }
  
};

exports.getRecords = async (query) => {
  const { page = 1, size = 10, search, filter } = query;
  const offset = (page - 1) * size;
  const where = {};

  if (search) {
    where.operation_response = { [Op.like]: `%${search}%` };
  }

  if (filter) {
    // Add filter conditions here
  }

  try {
    const records = await Record.findAndCountAll({
      where,
      limit: size,
      offset,
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

exports.updateRecord = async (id, recordData) => {
  try {
    const record = await Record.findByPk(id);
    if (!record) {
      throw new Error('Record not found');
    }
    await record.update(recordData);
    return record;
  } catch (error) {
    throw new Error('Error updating record: ' + error.message);
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

const executeOperation = async (operationType, amount, amount2) => {  
  console.log("type",operationType)
  switch(operationType) {
    case OperationType.ADDITION:
      return amount + amount2;
    case OperationType.SUBTRACTION:
      return amount - amount2;
    case OperationType.MULTIPLICATION:
      return amount *  amount2;
      case OperationType.DIVISION:
        if (amount2 === 0) {
          throw new Error('Division by zero is not allowed'); //Must have validation in the frontend
        }
        return amount / amount2;
      case OperationType.SQUARE_ROOT:
        if (amount < 0) {
          throw new Error('Square root of negative number is not allowed'); //Must have validation in the frontend
        }
        return Math.sqrt(amount);
      case OperationType.RANDOM_STRING:
        try {
          return getRandomString();
        } catch (error) {
          console.log(error);
          throw error;
        }
      
  }
}



const getRandomString = async () =>  {
  const axios = require('axios');
  console.log(process.env.RANDOM_KEY)
  const apiKey = process.env.RANDOM_KEY
  const requestData = {
    jsonrpc: '2.0',
    method: 'generateStrings',
    params: {
      apiKey: apiKey,
      n: 1,
      length: 10,
      characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      replacement: true
    },
    id: 1
  };
  
  try {
    const response = await axios.post('https://api.random.org/json-rpc/4/invoke', requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const randomString = response.data.result.random.data[0];
    return randomString;
  } catch (error) {
    console.log(error)
    throw new Error('Error fetching random string');
  }
}

  