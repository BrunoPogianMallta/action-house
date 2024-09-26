// src/utils/resetPassword.js
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { Op } = require('sequelize');

const resetUserPassword = async (token, newPassword) => {
  if (!token || !newPassword) {
    throw new Error('Token e nova senha são obrigatórios.');
  }

  const user = await User.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { [Op.gt]: Date.now() } // Verifica se o token não expirou
    }
  });

  if (!user) {
    throw new Error('Token inválido ou expirado.');
  }

  // Hash da nova senha
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Atualiza a senha do usuário e limpa os campos de token
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();
};

module.exports = resetUserPassword;
