const { User } = require('../models');

exports.addBalance = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.balance += amount;
    await user.save();

    res.status(200).json({ message: 'Balance added successfully', balance: user.balance });
  } catch (error) {
    console.error('Error adding balance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
