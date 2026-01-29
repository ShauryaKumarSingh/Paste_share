// Simple DB connectivity test using pg
require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const conn = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
if (!conn) {
  console.error('DATABASE_URL not set in .env.local');
  process.exit(2);
}

const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });

client.connect()
  .then(() => client.query('SELECT 1 as ok'))
  .then((res) => {
    console.log('DB connection OK:', res.rows[0]);
    return client.end();
  })
  .catch((err) => {
    console.error('DB connection error:', err.message || err);
    process.exit(1);
  });
