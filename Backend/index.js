import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// ✅ Correct frontend origin
app.use(cors({
  origin: "http://localhost:5173", // LOCAL TESTING
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Virtual Assistant Backend is running.");
});

app.listen(port, () => {
  connectDb();
  console.log(`🚀 Server started at http://localhost:${port}`);
});
