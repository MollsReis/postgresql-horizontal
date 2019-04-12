const { Pool } = require('pg');

const CONFIG = {
  host: 'db_primary',
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  max: 20,
};
const PostgreSQL = connFactory(new Pool(CONFIG));

function connFactory (pool) {
  const conn = {
    // run query that returns rows
    query: async (sql, params) => {
      const { rows } = await pool.query(sql, params);
      return rows || [];
    },

    // run query that returns only one row
    find: async (sql, params) => {
      const rows = await conn.query(sql, params);
      return rows.length ? rows[0] : null;
    },

    findValue: async (field, sql, params) => {
      const result = await conn.find(sql, params);
      return result[field];
    },

    // run query that does not return rows
    execute: async (sql, params) => {
      const { command, rowCount } = await pool.query(sql, params);
      return command && rowCount ? `${command} ${rowCount}` : null;
    },

    // bulk insert values (array of objects) into given table
    bulkInsert: async (table, values) => {
      // bail if we have nothing to insert
      if (values.length === 0) {
        return null;
      }

      const cols = Object.keys(values[0]);

      let params = [];
      const qs = values.map((row, idx) => {
        params = params.concat(cols.map(k => row[k]));
        return `(${cols.map((v, jdx) => `$${idx * cols.length + jdx + 1}`).
          join(', ')})`
      });

      const sql = `
        INSERT INTO ${table}
        (${cols.join(', ')})
        VALUES ${qs.join(', ')}`;

      return conn.execute(sql, params);
    }
  };
  return conn;
}

module.exports = PostgreSQL;
