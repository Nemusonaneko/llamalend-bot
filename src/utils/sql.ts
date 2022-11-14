import mysql from 'mysql2/promise';
import * as dotenv from "dotenv";
dotenv.config();

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