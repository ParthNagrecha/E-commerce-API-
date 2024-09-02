import pg from "pg";
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Retail App",
    password: "Parth@786",
    port: 5432,
  });
db.connect();


export default db