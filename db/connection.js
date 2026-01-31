const { Pool } = require("pg");
require("dotenv").config({ path: `${__dirname}/../.env.${process.env.NODE_ENV || "development"}` });


const useDatabaseUrl = !!process.env.DATABASE_URL;

const config = useDatabaseUrl
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 2,
    }
  : {
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      host: process.env.PGHOST || "localhost",
      port: Number(process.env.PGPORT) || 5432,
    };

module.exports = new Pool(config);

