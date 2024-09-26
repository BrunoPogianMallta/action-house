const crypto = require('crypto');

async function generateResetToken(user) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    await user.update({
        resetPasswordToken: resetToken,
        resetPasswordExpires: Date.now() + 3600000 // Token válido por 1 hora
    });
    return resetToken;
}

module.exports = generateResetToken;
