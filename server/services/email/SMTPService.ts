import nodemailer from 'nodemailer';
import { AppError } from '../../middleware/errorHandler.js';
import { EmailAccount } from '../../types/email.js';

export class SMTPService {
  private transporter: nodemailer.Transporter;

  constructor(account: EmailAccount) {
    this.transporter = nodemailer.createTransport({
      host: account.smtpConfig.host,
      port: account.smtpConfig.port,
      secure: account.smtpConfig.secure,
      auth: {
        user: account.email,
        pass: account.credentials.password
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async testConnection(): Promise<void> {
    try {
      await this.transporter.verify();
    } catch (error) {
      throw new AppError('Failed to connect to SMTP server', 400);
    }
  }

  async sendEmail(options: nodemailer.SendMailOptions): Promise<void> {
    try {
      await this.transporter.sendMail(options);
    } catch (error) {
      throw new AppError('Failed to send email', 500);
    }
  }
}