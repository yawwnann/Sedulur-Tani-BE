import bodyParser from "body-parser";
import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/routes/routes";

dotenv.config();

const app: Application = express();

// CORS Configuration
const corsOptions = {
  origin: true, // Allow all origins dynamically (good for development)
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/v1", router);

const PORT = process.env.PORT || 8686;

// For Vercel serverless
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Frontend: http://localhost:3000`);
    console.log(` CORS enabled for frontend`);
  });
}
