
import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import healthRoutes from "./routes/health.routes.js";
import {
  notFound,
  errorHandler,
} from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin:
      process.env.CLIENT_ORIGIN ||
      "http://localhost:5173",
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to RAG-Labs API",
  });
});

app.use("/api/health", healthRoutes);

// Keep these after all routes.
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `Server running at http://localhost:${PORT}`
    );
  });
};

startServer();
