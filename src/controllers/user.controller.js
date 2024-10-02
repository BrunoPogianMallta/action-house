const db = require('../models');
const bcrypt =require('bcrypt');
const jwt = require ('jsonwebtoken');
const generateResetToken = require('../utils/generateResetToken');
const sendResetEmail = require('../utils/sendResetEmail');
const resetUserPassword = require('../utils/resetPassword');

const { User } = db;
const { JWT_SECRET } = process.env;



exports.registerUser = async( req, res) =>{
    const {name , email, password } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({ error: 'Todo os campos são obrigatórios.'});
    }

    try {
        const existingUser = await User.findOne({where: { email }});
        if(existingUser){
            return res.status(409).json({error: 'E-mail já está cadastrado.'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });

      
        const token =jwt.sign({ id: newUser.id}, JWT_SECRET, { expiresIn: '1hr'});
        
        res.status(200).json({ message: 'Usuário registrado com sucesso!',token});

    } catch (error) {
        console.log('Erro ao registrar usuário:',error);
        res.status(500).json({error: 'Erro interno do servidor.'});       
    }
}

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
          email: user.email
        }
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  };

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
            accountType: user.accountType
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

      const resetToken = await generateResetToken(user);
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

  try {
      const user = await resetUserPassword(token, newPassword); 
      res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      res.status(400).json({ error: error.message });
  }
};