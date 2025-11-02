import { db } from '../lib/db/client';
import fs from 'fs';
import path from 'path';

async function initDatabase() {
  try {
    // Read and execute schema
    const schemaPath = path.join(process.cwd(), 'lib/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.length > 0) {
        try {
          await db.execute(statement);
        } catch (error: any) {
          // Ignore "table already exists" errors
          if (!error?.message?.includes('already exists')) {
            console.warn(`Warning executing statement: ${error.message}`);
          }
        }
      }
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

initDatabase()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });
