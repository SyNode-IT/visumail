import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { db } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class TwoFactorService {
  static async generateSecret(userId: number) {
    const secret = authenticator.generateSecret();
    
    db.prepare(
      'UPDATE users SET two_factor_secret = ?, two_factor_enabled = 0 WHERE id = ?'
    ).run(secret, userId);
    
    return secret;
  }

  static async generateQRCode(email: string, secret: string) {
    const serviceName = 'VisuMail';
    const otpauth = authenticator.keyuri(email, serviceName, secret);
    
    try {
      return await QRCode.toDataURL(otpauth);
    } catch (error) {
      throw new AppError('Failed to generate QR code', 500);
    }
  }

  static verifyToken(token: string, secret: string): boolean {
    return authenticator.verify({ token, secret });
  }

  static async enableTwoFactor(userId: number, token: string) {
    const user = db.prepare(
      'SELECT two_factor_secret FROM users WHERE id = ?'
    ).get(userId);

    if (!user?.two_factor_secret) {
      throw new AppError('2FA secret not found', 404);
    }

    if (!this.verifyToken(token, user.two_factor_secret)) {
      throw new AppError('Invalid 2FA token', 401);
    }

    db.prepare(
      'UPDATE users SET two_factor_enabled = 1 WHERE id = ?'
    ).run(userId);
  }

  static async validateToken(userId: number, token: string) {
    const user = db.prepare(
      'SELECT two_factor_secret FROM users WHERE id = ? AND two_factor_enabled = 1'
    ).get(userId);

    if (!user?.two_factor_secret) {
      return true; // 2FA not enabled, skip validation
    }

    return this.verifyToken(token, user.two_factor_secret);
  }
}