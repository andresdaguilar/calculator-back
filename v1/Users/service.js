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

