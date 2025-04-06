import { connectToDatabase } from "./mongodb";
import { v4 as uuidv4 } from "uuid";
import { hash, compare } from "bcryptjs";

const SESSION_EXPIRY = 12 * 60 * 60 * 1000;

const ensureIndexes = async (db) => {
  try {
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("users").createIndex({ id: 1 }, { unique: true });
    await db.collection("sessions").createIndex({ token: 1 }, { unique: true });
    await db.collection("sessions").createIndex({ userId: 1 });
    await db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
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

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  await db.collection("sessions").deleteMany({
    userId: user.id,
    expiresAt: { $lt: new Date() },
  });

  const sessionToken = uuidv4();
  const session = {
    token: sessionToken,
    userId: user.id,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + SESSION_EXPIRY),
    userAgent: process.env.NODE_ENV === "production" ? "production" : "development",
  };

  await db.collection("sessions").insertOne(session);

  return { id: user.id, email: user.email, sessionToken };
};

export const validateSession = async (sessionToken) => {
  const db = await getDb();

  const session = await db.collection("sessions").findOne({ token: sessionToken });
  if (!session) {
    throw new Error("Invalid session");
  }

  if (new Date(session.expiresAt) < new Date()) {
    await db.collection("sessions").deleteOne({ token: sessionToken });
    throw new Error("Session expired");
  }

  const user = await db.collection("users").findOne({ id: session.userId });
  if (!user) {
    throw new Error("User not found");
  }

  await db.collection("sessions").updateOne(
    { token: sessionToken },
    { $set: { expiresAt: new Date(Date.now() + SESSION_EXPIRY) } }
  );

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