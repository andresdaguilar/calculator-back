const Record = require('./RecordModel');
const { Op } = require('sequelize');

exports.createRecord = async (recordData) => {
  try {
    const record = await Record.create(recordData);
    return record;
  } catch (error) {
    throw new Error('Error creating record: ' + error.message);
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