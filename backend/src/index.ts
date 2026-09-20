import "dotenv/config";
import express from "express";
import cors from "cors";
import categoriesRouter from "./routes/categories";
import transactionsRouter from "./routes/transactions";
import budgetsRouter from "./routes/budgets";
import analyticsRouter from "./routes/analytics";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/categories", categoriesRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/budgets", budgetsRouter);
app.use("/api/analytics", analyticsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
