import * as dotenv from "dotenv";
import mysql from "mysql2/promise";

// Load environment variables
dotenv.config();

export async function setupDatabase() {
  console.log("Setting up database...");

  try {
    // Database connection configuration without database name
    const connectionConfig = {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || "3306"),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      ssl:
        process.env.DATABASE_SSL === "true"
          ? {
              rejectUnauthorized: false, // Allow self-signed certificates
            }
          : undefined,
    };

    console.log("Connection config:", {
      host: connectionConfig.host,
      port: connectionConfig.port,
      user: connectionConfig.user,
      ssl: !!connectionConfig.ssl,
    });

    // Create connection without specifying database
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Connected to MySQL server successfully!");

    const dbName = process.env.DATABASE_NAME || "defaultdb";

    // Check if database exists
    const [rows] = await connection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [dbName]
    );

    const dbExists = Array.isArray(rows) && rows.length > 0;

    if (!dbExists) {
      console.log(`Database '${dbName}' does not exist. Creating it...`);
      await connection.query(`CREATE DATABASE \`${dbName}\``);
      console.log(`Database '${dbName}' created successfully!`);
    } else {
      console.log(`Database '${dbName}' already exists.`);
    }

    // Verify we can connect to the database
    try {
      await connection.query(`USE \`${dbName}\``);
      console.log(`Successfully connected to database '${dbName}'.`);
    } catch (error) {
      console.error(`Error connecting to database '${dbName}':`, error);
      throw error;
    }

    // Close connection
    await connection.end();
    console.log("Connection closed.");

    return true;
  } catch (error) {
    console.error("Error setting up database:", error);
    return false;
  }
}

// When this file is run directly, execute the setup
if (process.argv[1] === import.meta.url) {
  setupDatabase().then((success) => {
    if (success) {
      console.log("Database setup completed successfully!");
    } else {
      console.error("Database setup failed!");
      process.exit(1);
    }
  });
}
