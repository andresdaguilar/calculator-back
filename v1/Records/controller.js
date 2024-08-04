const {
  createRecord,
  getRecords,
  getRecordById,
  deleteRecord,
} = require('./service');

exports.create = async (req, res) => {
  const { operation_id, amount, amount2 } = req.body;
  const { userId } = req;
  
  try {
    const record = await createRecord(operation_id,  amount, amount2, userId);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { userId } = req;
    const records = await getRecords(req.query, userId);
    res.json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const record = await getRecordById(req.params.id);
    res.json(record);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await deleteRecord(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};