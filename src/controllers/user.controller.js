const db = require('../models');
const bcrypt =require('bcrypt');
const jwt = require ('jsonwebtoken');
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

        //criar usuário
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        //gerar token JWT
        const token =jwt.sign({ id: newUser.id}, JWT_SECRET, { expiresIn: '1hr'});
        
        res.status(200).json({ message: 'Usuário registrado com sucesso!',token});

    } catch (error) {
        console.log('Erroao registrar usuário:',error);
        res.status(500).json({error: 'Erro interno do servidor.'});       
    }
}