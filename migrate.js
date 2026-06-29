const fs = require('fs');
const path = require('path');
const db = require('./database');
require('dotenv').config();

async function migrate() {
  try {
    console.log('Starting migration...');

    // Read existing data.json
    const dataFile = path.join(__dirname, 'data.json');
    if (!fs.existsSync(dataFile)) {
      console.log('No data.json file found. Nothing to migrate.');
      process.exit(0);
    }

    const fileData = fs.readFileSync(dataFile, 'utf8');
    const data = JSON.parse(fileData);

    console.log(`Found ${data.matches.length} matches to migrate`);

    // Connect to MongoDB
    await db.connectToDatabase();

    // Insert each match
    for (const match of data.matches) {
      try {
        await db.createMatch(match);
        console.log(`Migrated match ${match.id}: ${match.teamA} vs ${match.teamB}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Match ${match.id} already exists, skipping`);
        } else {
          throw error;
        }
      }
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
