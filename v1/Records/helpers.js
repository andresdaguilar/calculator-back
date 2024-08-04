const { Op } = require('sequelize');
const OperationType = require('./operationType.enum');

const filterConditions = (filter, where, operationWhere, filterableFields) => {
  const filterConditions = filter.split(',');
    filterConditions.forEach(condition => {
      console.log(condition)
      const [key, value] = condition.split('=');
      if (key === 'operation_id') {
        
        where.operation_id = value;
      } else if (key === 'cost') {
        const operatorValue = value.split(':');
        const operator = operatorValue[0];
        const costValue = operatorValue[1];
        if (operator === 'gt') {
          operationWhere.cost = { [Op.gt]: costValue };
        } else if (operator === 'lt') {
          operationWhere.cost = { [Op.lt]: costValue };
        } else if (operator === 'gte') {
          operationWhere.cost = { [Op.gte]: costValue };
        } else if (operator === 'lte') {
          operationWhere.cost = { [Op.lte]: costValue };
        } else if (operator === 'eq') {
          operationWhere.cost = costValue;
        }
      } else if (filterableFields.includes(key)) {
        applyFilter(where, key, value);
      }
    });
}

const applyFilter = (where, key, value) => {
  const operatorValue = value.split(':');
  const operator = operatorValue[0];
  const filterValue = operatorValue[1];
  
  switch (operator) {
    case 'gt':
      where[key] = { [Op.gt]: filterValue };
      break;
    case 'lt':
      where[key] = { [Op.lt]: filterValue };
      break;
    case 'gte':
      where[key] = { [Op.gte]: filterValue };
      break;
    case 'lte':
      where[key] = { [Op.lte]: filterValue };
      break;
    case 'eq':
      where[key] = filterValue;
      break;
    default:
      throw new Error(`Invalid operator: ${operator}`);
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

module.exports = { filterConditions, executeOperation, getRandomString }