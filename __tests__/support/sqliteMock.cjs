/* eslint-env jest */
const { DatabaseSync } = require('node:sqlite');
// Real SQLite SQL execution, shared across module reloads within a test file.
const databases = globalThis.__studySqliteDatabases ?? new Map();
globalThis.__studySqliteDatabases = databases;
const open = jest.fn(({ name }) => {
  if (!databases.has(name)) {
    databases.set(name, new DatabaseSync(':memory:'));
  }
  const database = databases.get(name);
  return {
    execute: jest.fn(async (sql, params = []) => {
      const statement = database.prepare(sql);
      if (statement.columns().length) {
        return { rows: statement.all(...params), rowsAffected: 0 };
      }
      const result = statement.run(...params);
      return {
        rows: [],
        rowsAffected: Number(result.changes),
        insertId: Number(result.lastInsertRowid),
      };
    }),
  };
});
function reset() {
  for (const database of databases.values()) {
    database.close();
  }
  databases.clear();
}
module.exports = { open, reset };
