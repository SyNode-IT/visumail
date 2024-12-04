import { initializeDatabase } from '../server/config/database.js';

async function initDb() {
  try {
    const db = await initializeDatabase();
    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

initDb();