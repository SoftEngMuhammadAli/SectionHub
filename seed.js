import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./lib/db.js";

async function seed() {
  await connectToDatabase();
  console.log("Connected to MongoDB.");

  const db = mongoose.connection.db;

  await db.collection("users").deleteMany({});
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  await db.collection("users").insertOne({
    name: "Admin User",
    email: "admin@sectionhub.com",
    password: hashedPassword,
    role: "ADMIN",
    createdAt: new Date(),
    updatedAt: new Date()
  });

  console.log("Admin user created (admin@sectionhub.com / password123)");
  process.exit();
}

seed().catch(console.error);
