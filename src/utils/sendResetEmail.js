const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendResetEmail(email, resetToken) {
    const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'Redefinição de Senha',
        text: `Você está recebendo este e-mail porque recebemos uma solicitação de redefinição de senha para sua conta.\n\n
        Clique no link abaixo para redefinir sua senha:\n\n
        ${process.env.BASE_URL}/reset-password/${resetToken}\n\n
        Se você não solicitou uma redefinição de senha, ignore este e-mail.\n`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendResetEmail;
