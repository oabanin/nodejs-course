import mysql from "mysql2";

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "nodejs-complete",
    password: "12345678",
    port:3306
})

const db = pool.promise();

export {db};