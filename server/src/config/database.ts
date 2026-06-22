import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'skillups',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Bandung-2005',
});

export default pool;
