import mysql from "mysql2";

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "node-complete",
    password: "123123",
    port:3306
})

const db = pool.promise();

export {db};