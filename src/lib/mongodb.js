import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI.toString();

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  await client.connect();
  const db = client.db("vatCoinsDB");

  cachedClient = client;
  cachedDb = db;

  console.log("Connected to MongoDB!");
  return { client, db };
}

export async function closeConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log("MongoDB connection closed.");
  }
}