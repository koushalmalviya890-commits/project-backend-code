const { MongoClient } = require("mongodb");

let client;
let db;

async function connectDB() {
  try {
    if (db) {
      return { db };
    }

    client = new MongoClient(process.env.DATABASE_URL);

    await client.connect();

    db = client.db(process.env.DB_NAME);

    console.log("MongoDB connected");

    return { db };
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}

module.exports = connectDB;
