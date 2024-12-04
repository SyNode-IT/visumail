export const AUTH = {
  JWT_EXPIRY: '24h',
  REFRESH_TOKEN_EXPIRY: '7d',
  PASSWORD_MIN_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_ATTEMPT_WINDOW: 15 * 60, // 15 minutes
};

export const EMAIL = {
  MAX_ATTACHMENTS: 10,
  MAX_ATTACHMENT_SIZE: 25 * 1024 * 1024, // 25MB
  MAX_RECIPIENTS: 50,
  FETCH_LIMIT: 50,
};

export const RATE_LIMITS = {
  LOGIN: {
    points: 10,
    duration: 900 // 15 minutes
  },
  REGISTER: {
    points: 5,
    duration: 3600 // 1 hour
  },
  EMAIL_SEND: {
    points: 60,
    duration: 3600 // 1 hour
  },
  EMAIL_FETCH: {
    points: 30,
    duration: 60 // 1 minute
  }
};