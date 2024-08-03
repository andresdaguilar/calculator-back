const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./UserModel');

exports.registerUser = async (email, password) => {
  //Check if user exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ email, password: hashedPassword });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1w' });

  return user;
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  console.log(user.status);
  if (user.status !== 'active'){
    throw new Error('User inactive');
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return { user, token };
};

exports.findOne = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error('User doesn\'t exists');
  }
  return user;
}

exports.patchUser = async (userId, updates) => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error('User doesn\'t exist');
  }
  await user.update(updates);
  return user;
};

exports.updateBalance = async (userId, newAmount) => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error('User doesn\'t exist');
  }

  // Update balance
  user.balance = newAmount;
  await user.save();
  return user;
};