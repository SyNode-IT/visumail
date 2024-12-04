export interface Email {
  id: string;
  subject: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  body: string;
  date: Date;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  labels: string[];
  attachments: Attachment[];
}

export interface Attachment {
  filename: string;
  contentType: string;
  size: number;
  content: Buffer;
}

export interface EmailAccount {
  id: string;
  email: string;
  name: string;
  imapConfig: {
    host: string;
    port: number;
    secure: boolean;
  };
  smtpConfig: {
    host: string;
    port: number;
    secure: boolean;
  };
}