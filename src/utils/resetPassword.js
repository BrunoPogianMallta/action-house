const jwt = require('jsonwebtoken');

const resetUserPassword = async (token, newPassword) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET); 
        const user = await User.findByPk(decoded.id);
        if (!user) throw new Error('Usuário não encontrado.');

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return user;
    } catch (error) {
        throw new Error('Token inválido ou expirado.'); 
    }
};


module.exports = resetUserPassword;