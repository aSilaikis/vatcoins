import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI?.toString();
if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cachedClient = global.mongoClient || null;
let cachedDb = global.mongoDb || null;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  minPoolSize: 1,
});

const retry = async (operation, maxAttempts = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, error.message);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
};

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    try {
      await cachedClient.db("admin").command({ ping: 1 });
      return { client: cachedClient, db: cachedDb };
    } catch (error) {
      console.warn("Cached connection is no longer valid, reconnecting...", error.message);
      cachedClient = null;
      cachedDb = null;
    }
  }

  try {
    await retry(async () => {
      await client.connect();
    });

    const db = client.db("vatCoinsDB");
    await client.db("admin").command({ ping: 1 });

    cachedClient = global.mongoClient = client;
    cachedDb = global.mongoDb = db;

    console.log("Successfully connected to MongoDB!");
    return { client: cachedClient, db: cachedDb };
  } catch (error) {
    console.error("MongoDB connection error:", error);

    if (error.name === "MongoNetworkError") {
      console.error("Network error details:", {
        message: error.message,
        cause: error.cause ? error.cause.message : "No cause specified",
        code: error.code || "No error code",
      });
    }

    throw error;
  }
}

export async function closeConnection() {
  if (cachedClient) {
    try {
      await cachedClient.close();
      console.log("MongoDB connection closed.");
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
    } finally {
      cachedClient = global.mongoClient = null;
      cachedDb = global.mongoDb = null;
    }
  }
}

process.on("SIGINT", async () => {
  await closeConnection();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeConnection();
  process.exit(0);
});