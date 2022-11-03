import mysql from 'mysql2/promise';

// CREATE TABLE emails (time INT, email VARCHAR(250), address VARCHAR(250), secret VARCHAR(250), PRIMARY KEY(email, address), INDEX `idx_time` (`time` ASC) VISIBLE);

const connection = mysql.createPool({
  host: 'emails-instance-1.cfzqvhmdccgb.eu-central-1.rds.amazonaws.com',
  port: 3306,
  user: 'admin',
  database: 'content',
  password: process.env.DB_PWD,
  waitForConnections: true,
  connectionLimit: 1,
});

export function execute(sql: string, values: any){
  return connection.execute(sql, values)
}