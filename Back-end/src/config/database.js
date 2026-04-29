const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 100, 
  idleTimeoutMillis: 30000, 
  connectionTimeoutMillis: 2000, 
});


pool.on('error', (err, client) => {
  console.error('Erro inesperado em cliente inativo do banco', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool, 
};