import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'mail.sensetranslate.com',
            port: 587, // Porta recomendada pelo Postmark (2525 como alternativa)
            secure: false, // TLS deve estar desativado para essas portas
            auth: {
                user: 'send@sensetranslate.com', // Sempre "apikey" no Postmark
                pass: 'dflix7778', // Token do Postmark
            },
        });
    }

    async sendWelcomeEmail(email: string, name: string, password: string) {
        const mailOptions = {
            from: 'marcio.barbosa@tecksolucoes.com.br', // E-mail cadastrado no Postmark
            to: email,
            subject: 'Bem-vindo ao nosso sistema!',
            text: `Olá ${name}, seja bem-vindo!\n\nSua senha gerada é: ${password}\n\nAltere sua senha após o login.`,
            html: `<p>Olá <strong>${name}</strong>, seja bem-vindo!</p>
                   <p>Sua senha gerada é: <strong>${password}</strong></p>
                   <p>Altere sua senha após o login.</p>`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('E-mail enviado com sucesso');
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
        }
    }
}
