import { connectToDatabase } from "./mongodb";
import { v4 as uuidv4 } from "uuid";

export const registerUser = async (email, password) => {
  const { db } = await connectToDatabase();

  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const id = uuidv4();

  const newUser = { id, email, password };
  await db.collection("users").insertOne(newUser);
  return { id, email };
};

export const loginUser = async (email, password) => {
  const { db } = await connectToDatabase();

  const user = await db.collection("users").findOne({ email, password });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  return { id: user.id, email: user.email }; 
};

export const getUserById = async (id) => {
  const { db } = await connectToDatabase();

  const user = await db.collection("users").findOne({ id });
  if (!user) {
    throw new Error("User not found");
  }

  return { id: user.id, email: user.email };
};