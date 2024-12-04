export interface User {
  id: number;
  email: string;
  password: string;
  twoFactorSecret?: string;
  twoFactorEnabled: boolean;
  createdAt: Date;
}