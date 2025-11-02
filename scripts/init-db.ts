import { db } from '../lib/db/client';
import fs from 'fs';
import path from 'path';

async function initDatabase() {
  try {
    // Read and execute schema
    const schemaPath = path.join(process.cwd(), 'lib/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Split by semicolon but handle multi-line statements better
    const lines = schema.split('\n');
    let currentStatement = '';
    
    for (const line of lines) {
      // Skip comments
      const trimmed = line.trim();
      if (trimmed.startsWith('--') || trimmed.length === 0) {
        continue;
      }
      
      currentStatement += line + '\n';
      
      // If line ends with semicolon, execute the statement
      if (trimmed.endsWith(';')) {
        const statement = currentStatement.trim();
        if (statement.length > 0 && !statement.startsWith('--')) {
          try {
            await db.execute(statement);
          } catch (error: any) {
            // Ignore "table already exists" and similar SQLite errors
            const errorMsg = error?.message || '';
            if (
              errorMsg.includes('already exists') || 
              errorMsg.includes('duplicate column') ||
              errorMsg.includes('no such table')
            ) {
              // These are expected for idempotent runs
              console.warn(`Warning: ${errorMsg.substring(0, 60)}...`);
            } else {
              console.error(`Error executing statement: ${errorMsg}`);
              throw error;
            }
          }
        }
        currentStatement = '';
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
