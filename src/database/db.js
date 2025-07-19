const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

let pool;

if (process.env.NODE_ENV === "production") {
  // Running on Railway with injected env vars
  pool = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: {
      rejectUnauthorized: false, // Required for Railway SSL
    },
  });
} else {
  // Local development with DATABASE_URL
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

module.exports = pool;
