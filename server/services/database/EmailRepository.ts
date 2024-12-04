import { getDb } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { Email, EmailAccount } from '../../types/email.js';

export class EmailRepository {
  static async findEmailsByUserId(userId: number, filters: {
    status?: string;
    priority?: string;
    label?: string;
  } = {}): Promise<Email[]> {
    const db = getDb();
    let query = `
      SELECT e.* 
      FROM emails e
      JOIN email_accounts a ON e.account_id = a.id
      WHERE a.user_id = ?
    `;
    const params: any[] = [userId];

    if (filters.status) {
      query += ' AND e.status = ?';
      params.push(filters.status);
    }
    if (filters.priority) {
      query += ' AND e.priority = ?';
      params.push(filters.priority);
    }
    if (filters.label) {
      query += ' AND e.labels LIKE ?';
      params.push(`%${filters.label}%`);
    }

    query += ' ORDER BY e.received_date DESC';

    return db.prepare(query).all(params);
  }

  static async saveEmail(email: Partial<Email>): Promise<number> {
    const db = getDb();
    try {
      const result = db.prepare(`
        INSERT INTO emails (
          account_id, message_id, subject, from_address,
          to_addresses, cc_addresses, bcc_addresses,
          body, received_date, status, priority, labels
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        email.accountId,
        email.messageId,
        email.subject,
        email.from,
        JSON.stringify(email.to),
        JSON.stringify(email.cc),
        JSON.stringify(email.bcc),
        email.body,
        email.receivedDate?.toISOString(),
        email.status || 'todo',
        email.priority || 'medium',
        JSON.stringify(email.labels)
      );
      return result.lastInsertRowid as number;
    } catch (error) {
      throw new AppError('Failed to save email', 500);
    }
  }

  static async updateEmailStatus(emailId: number, status: string): Promise<void> {
    const db = getDb();
    db.prepare('UPDATE emails SET status = ? WHERE id = ?').run(status, emailId);
  }

  static async findAccountById(accountId: number, userId: number): Promise<EmailAccount | null> {
    const db = getDb();
    return db.prepare(
      'SELECT * FROM email_accounts WHERE id = ? AND user_id = ?'
    ).get(accountId, userId);
  }

  static async saveAccount(account: Partial<EmailAccount>, userId: number): Promise<number> {
    const db = getDb();
    try {
      const result = db.prepare(`
        INSERT INTO email_accounts (
          user_id, email, name, imap_host, imap_port,
          imap_secure, smtp_host, smtp_port, smtp_secure,
          credentials
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId,
        account.email,
        account.name,
        account.imapConfig?.host,
        account.imapConfig?.port,
        account.imapConfig?.secure ? 1 : 0,
        account.smtpConfig?.host,
        account.smtpConfig?.port,
        account.smtpConfig?.secure ? 1 : 0,
        account.credentials?.password
      );
      return result.lastInsertRowid as number;
    } catch (error) {
      throw new AppError('Failed to save email account', 500);
    }
  }

  static async deleteAccount(accountId: number, userId: number): Promise<boolean> {
    const db = getDb();
    const result = db.prepare(
      'DELETE FROM email_accounts WHERE id = ? AND user_id = ?'
    ).run(accountId, userId);
    return result.changes > 0;
  }
}