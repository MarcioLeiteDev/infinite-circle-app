import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail', // Ou 'outlook', 'yahoo', etc.
            auth: {
                user: 'marciodisbiriflix@gmail.com', // Altere para seu e-mail
                pass: 'Dflix@7778', // Altere para sua senha (ou use um App Password do Google)
            },
        });
    }

    async sendWelcomeEmail(email: string, name: string, password: string) {
        const mailOptions = {
            from: 'marciodisbiriflix@gmail.com',
            to: email,
            subject: 'Bem-vindo ao nosso sistema!',
            text: `Olá ${name}, seja bem-vindo!\n\nSua senha gerada é: ${password}\n\nAltere sua senha após o login.`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('E-mail enviado com sucesso');
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
        }
    }
}
