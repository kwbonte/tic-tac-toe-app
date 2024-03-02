import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tic_tac_toe",
  password: "yourPassword",
  port: 5432,
});

export default pool;
