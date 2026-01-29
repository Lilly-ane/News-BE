const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config = {};

// Production (Render/Supabase)
if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
  config.ssl = { rejectUnauthorized: false }; // important for Supabase/Render
} else {
  // Local dev/test
  config.user = process.env.PGUSER;
  config.password = process.env.PGPASSWORD;
  config.database = process.env.PGDATABASE;
  config.host = process.env.PGHOST || "localhost";
  config.port = Number(process.env.PGPORT) || 5432;
}

module.exports = new Pool(config);

