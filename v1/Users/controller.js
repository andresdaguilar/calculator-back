const {
  registerUser,
  loginUser,
  updateBalance
} = require('./service');


exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await registerUser(email, password);
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await loginUser(email, password);    
    res.json({ email: user.email, token, balance: user.balance });
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message });
  }
};

exports.updateBalance = async(req, res) => {
  console.log("UserId",req.userId);
  const { userId } = req;
  const { new_balance} = req.body;
  console.log(userId);
  try {
    const result = await updateBalance(userId, new_balance);
    res.json({new_balance: result})
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
