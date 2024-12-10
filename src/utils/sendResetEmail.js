require('dotenv').config(); 

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
        html: `
            <p>Você está recebendo este e-mail porque recebemos uma solicitação de redefinição de senha para sua conta.</p>
            <p>
                Clique no link abaixo para redefinir sua senha:<br>
                <a href="${process.env.BASE_URL}/reset-password/${resetToken}" style="color: #007bff; text-decoration: none;">Redefinir Senha</a>
            </p>
            <p>Se você não solicitou uma redefinição de senha, ignore este e-mail.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail de redefinição de senha enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar o e-mail de redefinição de senha:', error);
    }
}


module.exports = sendResetEmail;
