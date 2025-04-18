import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection configuration
const connectionConfig = {
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: process.env.DATABASE_SSL === 'true' ? {
    rejectUnauthorized: false, // Allow self-signed certificates
  } : undefined,
};

// Create connection pool
export const pool = mysql.createPool(connectionConfig);

// Create Drizzle ORM instance
export const db = drizzle(pool);

// Simple query function for direct SQL queries
export async function query(sql: string, params?: any[]) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Test connection
export async function testConnection() {
  try {
    const result = await query('SELECT 1 as dbIsUp');
    return { status: 'ok', database: 'connected', result };
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}
