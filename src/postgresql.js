const { Pool } = require('pg');
const { chunk } = require('lodash');

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
    bulkInsert: async (table, values, chunkSize = 500) => {
      // bail if we have nothing to insert
      if (values.length === 0) {
        return null;
      }

      // TODO ensure all objects have the same keys
      const cols = Object.keys(values[0]);

      // batch inserts
      for (const valuesChunk of chunk(values, chunkSize)) {
        let params = [];
        const qs = valuesChunk.map((row, idx) => {
          params = params.concat(cols.map(k => row[k]));
          return `(${cols.map((v, jdx) => `$${idx * cols.length + jdx + 1}`).
          join(', ')})`
        });

        const sql = `
          INSERT INTO ${table}
          (${cols.join(', ')})
          VALUES ${qs.join(', ')}`;

        await conn.execute(sql, params);
      }
    }
  };
  return conn;
}

module.exports = PostgreSQL;
