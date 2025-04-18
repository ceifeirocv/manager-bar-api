import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

export default {
  schema: "./src/db/schema/auth.ts",
  out: "./src/db/migrations",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DATABASE_HOST || "",
    port: parseInt(process.env.DATABASE_PORT || "3306"),
    user: process.env.DATABASE_USER || "",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "",
    ssl:
      process.env.DATABASE_SSL === "true"
        ? {
            rejectUnauthorized: false, // Allow self-signed certificates
          }
        : undefined,
  },
};
