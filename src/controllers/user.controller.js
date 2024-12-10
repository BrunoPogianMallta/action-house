const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateResetToken = require('../utils/generateResetToken');
const sendResetEmail = require('../utils/sendResetEmail');
const resetUserPassword = require('../utils/resetPassword');
const { User } = db;
const { JWT_SECRET } = process.env;

// Função de validação da nova senha
const validateNewPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Registrar novo usuário
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'E-mail já está cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1hr' });

    res.status(200).json({ message: 'Usuário registrado com sucesso!', token });
  } catch (error) {
    console.log('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Login do usuário
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1hr' });

    res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Obter detalhes do usuário
exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      accountType: user.accountType,
    });
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'O e-mail é obrigatório.' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    
    const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '5m' });
    
    // Enviar o e-mail com o token de redefinição
    await sendResetEmail(email, resetToken);

    res.status(200).json({ message: 'E-mail de redefinição de senha enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });
  }

  if (!validateNewPassword(newPassword)) {
    return res.status(400).json({
      error: 'A nova senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um número.',
    });
  }

  try {
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

   
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      password: hashedPassword,
    });

    res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Token expirado.' });
    }
    res.status(400).json({ error: 'Token inválido ou erro no processamento da senha.' });
  }
};
