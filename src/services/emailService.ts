import Imap from 'imap';
import nodemailer from 'nodemailer';
import { Email, EmailAccount } from '../types/email';

export class EmailService {
  private imap: Imap;
  private transporter: nodemailer.Transporter;

  constructor(account: EmailAccount) {
    this.imap = new Imap({
      user: account.email,
      host: account.imapConfig.host,
      port: account.imapConfig.port,
      tls: account.imapConfig.secure,
    });

    this.transporter = nodemailer.createTransport({
      host: account.smtpConfig.host,
      port: account.smtpConfig.port,
      secure: account.smtpConfig.secure,
    });
  }

  async fetchEmails(): Promise<Email[]> {
    return new Promise((resolve, reject) => {
      this.imap.once('ready', () => {
        this.imap.openBox('INBOX', false, (err, box) => {
          if (err) reject(err);

          const fetch = this.imap.seq.fetch('1:*', {
            bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
            struct: true,
          });

          const emails: Email[] = [];

          fetch.on('message', (msg) => {
            // Process email message
            // Convert to Email interface format
          });

          fetch.once('error', (err) => {
            reject(err);
          });

          fetch.once('end', () => {
            resolve(emails);
          });
        });
      });

      this.imap.connect();
    });
  }

  async sendEmail(email: Partial<Email>): Promise<void> {
    await this.transporter.sendMail({
      from: email.from,
      to: email.to?.join(', '),
      cc: email.cc?.join(', '),
      bcc: email.bcc?.join(', '),
      subject: email.subject,
      text: email.body,
    });
  }
}