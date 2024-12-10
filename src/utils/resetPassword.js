const bcrypt = require('bcrypt');  
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const db = require('../models');
const { User } = db;

const resetUserPassword = async (token, newPassword) => {
  try {
    
    const decoded = jwt.verify(token, JWT_SECRET);

    
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

 
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    
    user.password = hashedPassword;
    await user.save();

    return user; 

  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    throw new Error('Token inválido ou expirado.');
  }
};

module.exports = resetUserPassword;
