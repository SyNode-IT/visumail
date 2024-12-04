import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { promisify } from 'util';
import { AppError } from '../../middleware/errorHandler.js';
import { Email, EmailAccount } from '../../types/email.js';

export class IMAPService {
  private imap: Imap;

  constructor(account: EmailAccount) {
    this.imap = new Imap({
      user: account.email,
      password: account.credentials.password,
      host: account.imapConfig.host,
      port: account.imapConfig.port,
      tls: account.imapConfig.secure,
      tlsOptions: { rejectUnauthorized: false }
    });
  }

  async testConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap.once('ready', () => {
        this.imap.end();
        resolve();
      });
      this.imap.once('error', reject);
      this.imap.connect();
    });
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
                email.messageId = parsed.messageId;
                email.subject = parsed.subject;
                email.from = parsed.from?.text || '';
                email.to = parsed.to?.text.split(',') || [];
                email.cc = parsed.cc?.text.split(',') || [];
                email.bcc = parsed.bcc?.text.split(',') || [];
                email.receivedDate = parsed.date || new Date();
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
}