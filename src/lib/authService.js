import { connectToDatabase } from "./mongodb";
import { v4 as uuidv4 } from "uuid";
import { hash, compare } from "bcryptjs";

const ensureIndexes = async (db) => {
  try {
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("users").createIndex({ id: 1 }, { unique: true });
    await db.collection("sessions").createIndex({ token: 1 }, { unique: true });
    await db.collection("sessions").createIndex({ userId: 1 });
  } catch (error) {
    console.error("Error creating indexes:", error.message);
    throw error;
  }
};

let dbInstance = null;
const getDb = async () => {
  if (!dbInstance) {
    const { db } = await connectToDatabase();
    dbInstance = db;
    await ensureIndexes(dbInstance);
  }
  return dbInstance;
};

export const registerUser = async (email, password) => {
  const db = await getDb();

  const existingUser = await db.collection("users").findOne({
    email: { $regex: new RegExp(`^${email}$`, "i") },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const id = uuidv4();
  const hashedPassword = await hash(password, 12);
  const newUser = {
    id,
    email: email.toLowerCase(),
    password: hashedPassword,
    watchlist: [],
    createdAt: new Date(),
  };

  await db.collection("users").insertOne(newUser);
  return { id, email: newUser.email };
};

export const loginUser = async (email, password) => {
  const db = await getDb();
  const user = await db.collection("users").findOne({
    email: { $regex: new RegExp(`^${email}$`, "i") },
  });
  if (!user) throw new Error("Invalid email or password");

  const passwordMatch = await compare(password, user.password);
  if (!passwordMatch) throw new Error("Invalid email or password");

  const sessionToken = uuidv4();
  const session = {
    token: sessionToken,
    userId: user.id,
    createdAt: new Date(),
    userAgent: process.env.NODE_ENV === "production" ? "production" : "development",
  };

  await db.collection("sessions").insertOne(session);
  return { id: user.id, email: user.email, sessionToken };
};

export const validateSession = async (sessionToken) => {
  const db = await getDb();
  const session = await db.collection("sessions").findOne({ token: sessionToken });
  if (!session) throw new Error("Invalid session");

  const user = await db.collection("users").findOne({ id: session.userId });
  if (!user) throw new Error("User not found");

  return { id: user.id, email: user.email };
};

export const logoutUser = async (sessionToken) => {
  if (!sessionToken) {
    return { message: "No session to delete", deletedCount: 0 };
  }

  const db = await getDb();

  const result = await db.collection("sessions").deleteOne({ token: sessionToken });
  return {
    message: result.deletedCount > 0 ? "Session deleted successfully" : "Session not found",
    deletedCount: result.deletedCount,
  };
};

export const addToWatchlist = async (userId, coinUuid) => {
  const db = await getDb();
  
  const user = await db.collection("users").findOne({ id: userId });
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.watchlist) {
    await db.collection("users").updateOne(
      { id: userId },
      { $set: { watchlist: [] } }
    );
  }

  const result = await db.collection("users").updateOne(
    { id: userId },
    { $addToSet: { watchlist: coinUuid } }
  );

  return {
    message: "Coin added to watchlist",
    modifiedCount: result.modifiedCount
  };
};

export const removeFromWatchlist = async (userId, coinUuid) => {
  const db = await getDb();
  
  const user = await db.collection("users").findOne({ id: userId });
  if (!user) {
    throw new Error("User not found");
  }

  const result = await db.collection("users").updateOne(
    { id: userId },
    { $pull: { watchlist: coinUuid } }
  );

  return {
    message: "Coin removed from watchlist",
    modifiedCount: result.modifiedCount
  };
};

export const getUserWatchlist = async (userId) => {
  const db = await getDb();
  
  const user = await db.collection("users").findOne({ id: userId });
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.watchlist) {
    await db.collection("users").updateOne(
      { id: userId },
      { $set: { watchlist: [] } }
    );
    return [];
  }
  return user.watchlist;
};