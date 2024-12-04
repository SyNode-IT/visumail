import Imap from 'imap';
import { simpleParser } from 'mailparser';
import nodemailer from 'nodemailer';
import { promisify } from 'util';
import { AppError } from '../middleware/errorHandler';
import { EmailAccount, Email } from '../types/email';

export class EmailService {
  private imap: Imap;
  private transporter: nodemailer.Transporter;

  constructor(account: EmailAccount) {
    this.imap = new Imap({
      user: account.email,
      password: account.credentials.password,
      host: account.imapConfig.host,
      port: account.imapConfig.port,
      tls: account.imapConfig.secure,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 3000
    });

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
      await new Promise((resolve, reject) => {
        this.imap.once('ready', resolve);
        this.imap.once('error', reject);
        this.imap.connect();
      });
      this.imap.end();
      await this.transporter.verify();
    } catch (error) {
      throw new AppError('Failed to connect to email server', 400);
    }
  }

  async fetchEmails(folder = 'INBOX', limit = 50): Promise<Email[]> {
    return new Promise((resolve, reject) => {
      const emails: Email[] = [];

      this.imap.once('ready', () => {
        this.imap.openBox(folder, false, (err, box) => {
          if (err) return reject(err);

          const fetch = this.imap.seq.fetch(`${Math.max(1, box.messages.total - limit + 1)}:*`, {
            bodies: ['HEADER', 'TEXT'],
            struct: true
          });

          fetch.on('message', (msg) => {
            const email: any = {};

            msg.on('body', async (stream, info) => {
              const parsed = await simpleParser(stream);
              if (info.which === 'HEADER') {
                email.id = parsed.messageId;
                email.subject = parsed.subject;
                email.from = parsed.from?.text || '';
                email.to = parsed.to?.text.split(',') || [];
                email.date = parsed.date || new Date();
              } else {
                email.body = parsed.text || '';
                email.attachments = parsed.attachments || [];
              }
            });

            msg.once('end', () => {
              emails.push(email);
            });
          });

          fetch.once('error', reject);
          fetch.once('end', () => {
            this.imap.end();
            resolve(emails);
          });
        });
      });

      this.imap.once('error', reject);
      this.imap.connect();
    });
  }

  async sendEmail(options: nodemailer.SendMailOptions): Promise<void> {
    try {
      await this.transporter.sendMail(options);
    } catch (error) {
      throw new AppError('Failed to send email', 500);
    }
  }
}