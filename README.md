# VisuMail - Visual Email Management

VisuMail is a modern email management application that helps you organize your emails using a Kanban-style interface. It features a React frontend with a Node.js/Express backend, supporting multiple email accounts and secure authentication.

## Features

- 📧 Kanban-style email organization
- 🔒 Secure authentication with JWT and 2FA support
- 📱 Responsive design with Tailwind CSS
- 📨 IMAP/SMTP integration for email handling
- 🔄 Real-time updates
- 🎯 Email prioritization and labeling
- 🛡️ Rate limiting and security features

## Prerequisites

- Node.js 18 or higher
- SQLite 3
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/SyNode-IT/visumail.git
cd visumail
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=3000
JWT_SECRET=your-secure-secret-key
FRONTEND_URL=http://localhost:5173
```

5. Initialize the database:
```bash
npm run db:init
```

## Development

1. Start the backend server:
```bash
npm run server
```

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Production Deployment

1. Build the frontend:
```bash
npm run build
```

2. Start the production server:
```bash
NODE_ENV=production npm run start
```

## Email Configuration

To add an email account, you'll need:
- IMAP server details (host, port, SSL/TLS settings)
- SMTP server details (host, port, SSL/TLS settings)
- Email address and password

Common email provider settings:

### Gmail
```
IMAP:
- Host: imap.gmail.com
- Port: 993
- Security: SSL/TLS

SMTP:
- Host: smtp.gmail.com
- Port: 465
- Security: SSL/TLS
```

### Outlook/Office 365
```
IMAP:
- Host: outlook.office365.com
- Port: 993
- Security: SSL/TLS

SMTP:
- Host: smtp.office365.com
- Port: 587
- Security: STARTTLS
```

Note: For Gmail, you'll need to use an App Password if 2FA is enabled.

## Security Considerations

1. Update the JWT secret in production
2. Enable CORS only for trusted domains
3. Use secure HTTPS in production
4. Regularly update dependencies
5. Store email credentials securely
6. Enable rate limiting

## Database Schema

The application uses SQLite with the following schema:

```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  two_factor_secret TEXT,
  two_factor_enabled INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Email accounts table
CREATE TABLE email_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  imap_host TEXT NOT NULL,
  imap_port INTEGER NOT NULL,
  imap_secure INTEGER NOT NULL,
  smtp_host TEXT NOT NULL,
  smtp_port INTEGER NOT NULL,
  smtp_secure INTEGER NOT NULL,
  credentials TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Emails table
CREATE TABLE emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  message_id TEXT NOT NULL,
  subject TEXT,
  from_address TEXT NOT NULL,
  to_addresses TEXT NOT NULL,
  cc_addresses TEXT,
  bcc_addresses TEXT,
  body TEXT,
  received_date DATETIME NOT NULL,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  labels TEXT,
  FOREIGN KEY (account_id) REFERENCES email_accounts (id) ON DELETE CASCADE
);
```

## API Documentation

### Authentication

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/2fa/setup
POST /api/auth/2fa/verify
```

### Email Management

```
GET /api/emails
POST /api/emails
PATCH /api/emails/:id/status
```

### Email Accounts

```
GET /api/emails/accounts
POST /api/emails/accounts
DELETE /api/emails/accounts/:id
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
