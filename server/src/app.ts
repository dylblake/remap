import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import knex from "knex";
import knexConfig from "../knexfile";
import express from "express";
import cors from "cors";
import serviceRoutes from "./routes/serviceRoutes";
import domainRoutes from "./routes/domainRoutes";
console.log("process.env.PORT", process.env.PORT);

const environment = process.env.NODE_ENV || "development";
const db = knex(knexConfig[environment]);

// Run migrations on startup
db.migrate
  .latest()
  .then(() => {
    console.log("Database migrated successfully");
  })
  .catch((err: unknown) => {
    if (err instanceof Error) {
      console.error("Error running migrations:", err.message);
    } else {
      console.error("Unknown error running migrations");
    }
    process.exit(1);
  });

const app = express();
const port = process.env.PORT || 5001;

// CORS
app.use(
  cors({
    origin: "http://localhost:5176",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/services", serviceRoutes);

app.use("/api/domains", domainRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
