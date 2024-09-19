import mongoose from "mongoose";
import { config } from "dotenv";

config();

const DB_URL = process.env.DATABASE_URL || "";

mongoose
  .connect(DB_URL as string)
  .then(() => {
    console.log("Connected to the database successfully");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
