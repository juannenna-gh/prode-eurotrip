const { MongoClient } = require('mongodb');

let client;
let db;
let matchesCollection;

async function connectToDatabase() {
  if (db) return db;

  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');

    db = client.db('prode');
    matchesCollection = db.collection('matches');

    // Create index on match ID
    await matchesCollection.createIndex({ id: 1 }, { unique: true });

    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

async function getMatches() {
  await connectToDatabase();
  const matches = await matchesCollection.find({}).sort({ id: 1 }).toArray();
  return matches;
}

async function getNextMatchId() {
  await connectToDatabase();
  const lastMatch = await matchesCollection.findOne({}, { sort: { id: -1 } });
  return lastMatch ? lastMatch.id + 1 : 1;
}

async function createMatch(match) {
  await connectToDatabase();
  await matchesCollection.insertOne(match);
  return match;
}

async function updateMatch(id, updates) {
  await connectToDatabase();
  await matchesCollection.updateOne({ id: parseInt(id) }, { $set: updates });
  const match = await matchesCollection.findOne({ id: parseInt(id) });
  return match;
}

async function deleteMatch(id) {
  await connectToDatabase();
  await matchesCollection.deleteOne({ id: parseInt(id) });
}

module.exports = {
  connectToDatabase,
  getMatches,
  getNextMatchId,
  createMatch,
  updateMatch,
  deleteMatch
};
