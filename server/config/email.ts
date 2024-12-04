export const emailProviders = {
  gmail: {
    name: 'Gmail',
    domains: ['gmail.com', 'googlemail.com'],
    imap: {
      host: 'imap.gmail.com',
      port: 993,
      secure: true
    },
    smtp: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true
    }
  },
  outlook: {
    name: 'Outlook',
    domains: ['outlook.com', 'hotmail.com', 'live.com'],
    imap: {
      host: 'outlook.office365.com',
      port: 993,
      secure: true
    },
    smtp: {
      host: 'smtp.office365.com',
      port: 587,
      secure: false
    }
  }
};

export function detectEmailProvider(email: string) {
  const domain = email.split('@')[1].toLowerCase();
  
  for (const [key, provider] of Object.entries(emailProviders)) {
    if (provider.domains.includes(domain)) {
      return {
        name: provider.name,
        config: provider
      };
    }
  }
  
  return null;
}