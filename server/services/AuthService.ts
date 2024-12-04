import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../config/database';
import { AppError } from '../middleware/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-secret-key';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(userId: number, email: string): string {
    return jwt.sign(
      { id: userId, email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  static async createUser(email: string, password: string) {
    try {
      const hashedPassword = await this.hashPassword(password);
      const result = db.prepare(
        'INSERT INTO users (email, password) VALUES (?, ?)'
      ).run(email, hashedPassword);
      
      return result.lastInsertRowid;
    } catch (error) {
      throw new AppError('Failed to create user', 500);
    }
  }

  static async validateUser(email: string, password: string) {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user || !await this.verifyPassword(password, user.password)) {
      throw new AppError('Invalid credentials', 401);
    }

    return user;
  }

  static async getUserById(id: number) {
    const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}