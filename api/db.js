const { MongoClient } = require('mongodb');

let client = null;
let db = null;

async function connectToDB() {
  try {
    client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db('mernblog');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

function getArticleCollection() {
  if (!db) {
    throw new Error('Database connection not established');
  }
  return db.collection('article');
}

module.exports = {
  connectToDB,
  getArticleCollection,
};
