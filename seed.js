import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./lib/db.js";

async function seed() {
  await connectToDatabase();
  console.log("Connected to MongoDB.");

  const db = mongoose.connection.db;

  await db.collection("users").deleteMany({});
  const hashedPassword = await bcrypt.hash("password123", 10);

  const name = "Muhammad Ali";
  const email = "admin@gmail.com";

  await db.collection("users").insertOne({
    name: name,
    email: email,
    passwordHash: hashedPassword,
    role: "ADMIN",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log(
    `Admin Created with Name: ${name} & Email: ${email} & Password: ${passwordHash}`,
  );
  process.exit();
}

seed().catch(console.error);
