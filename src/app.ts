import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
import Router from "./controllers";

const app = express();
app.use(Router);
dotenv.config(); //Reads .env file and makes it accessible via process.env
export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT|| ""),
  ssl: {
    rejectUnauthorized: false,
    ca: process.env.CACERT,
  }
});

const connectToDB = async () => {
  try {
    await pool.connect();
    console.log("Connected with Digital Ocean DB!");
  } catch (err) {
    console.log(err);
  }
};

connectToDB();


app.get("/test", (_req: Request, res: Response, _next: NextFunction) => {
  res.send("hi Circular miners");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});
