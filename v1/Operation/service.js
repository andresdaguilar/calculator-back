const Operation = require('./OperationModel');

exports.findAll = async () => {
  try{
    return await Operation.findAll();
  } catch (error) {
    throw new Error('Error fetching operations' + error.message);
  }
}

exports.findOne = async (id) => {
  try{
    return await Operation.findOne( { where: { id } });
  } catch (error) {
    throw new Error('Error fetching operation' + error.message);
  }
}

exports.createOperation = async (type, cost) => {
  try {
    const operation = await Operation.create({ type, cost });
    return operation;
  } catch (error) {
    throw new Error('Error creating operation: ' + error.message);
  }
};

exports.updateOperation = async (id, type, cost) => {
  try {
    const operation = await Operation.findByPk(id);
    if (!operation) {
      throw new Error('Operation not found');
    }
    operation.type = type;
    operation.cost = cost;
    await operation.save();
    return operation;
  } catch (error) {
    throw new Error('Error updating operation: ' + error.message);
  }
};

exports.deleteOperation = async (id) => {
  try {
    const operation = await Operation.findByPk(id);
    if (!operation) {
      throw new Error('Operation not found');
    }
    await operation.destroy();
    return { message: 'Operation deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting operation: ' + error.message);
  }
};