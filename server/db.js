import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

const dbPath = process.env.DATABASE_PATH || './data/registrations.db';

// Ensure directory exists
mkdirSync(dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT,
    category TEXT NOT NULL CHECK(category IN ('pro-men', 'pro-women', 'amateur', 'junior')),
    experience INTEGER,
    kite_size REAL,
    lang TEXT NOT NULL DEFAULT 'en',
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'waitlist', 'cancelled')),
    confirmation_token TEXT UNIQUE,
    ip TEXT
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_email ON registrations(email);
`);

export default db;
