const {
  createOperation,
  findAll,
  updateOperation,
  deleteOperation
} = require('./service');

exports.create = async (req, res) => {
  const { type, cost } = req.body;

  try {
    const operation = await createOperation(type, cost);
    res.status(201).json(operation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const operations = await findAll();
    res.json(operations)
  } catch (error) {
    res.status(400).json({message: 'Error getting operations'})
  }
}

exports.update = async (req, res) => {
  const { id } = req.params;
  const { type, cost } = req.body;

  try {
    const operation = await updateOperation(id, type, cost);
    res.json(operation);
  } catch (error) {
    if (error.message === 'Operation not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteOperation(id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Operation not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};
