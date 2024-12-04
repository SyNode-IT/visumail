import { getDb } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { User } from '../../types/user.js';

export class UserRepository {
  static async findByEmail(email: string): Promise<User | null> {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }

  static async findById(id: number): Promise<User | null> {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }

  static async create(email: string, hashedPassword: string): Promise<number> {
    const db = getDb();
    try {
      const result = db.prepare(
        'INSERT INTO users (email, password) VALUES (?, ?)'
      ).run(email, hashedPassword);
      return result.lastInsertRowid as number;
    } catch (error) {
      throw new AppError('Failed to create user', 500);
    }
  }

  static async updateTwoFactorSecret(userId: number, secret: string): Promise<void> {
    const db = getDb();
    db.prepare(
      'UPDATE users SET two_factor_secret = ?, two_factor_enabled = 0 WHERE id = ?'
    ).run(secret, userId);
  }

  static async enableTwoFactor(userId: number): Promise<void> {
    const db = getDb();
    db.prepare(
      'UPDATE users SET two_factor_enabled = 1 WHERE id = ?'
    ).run(userId);
  }
}