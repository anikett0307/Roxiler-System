const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function initDB() {
  let connection;
  try {
    // Connect without specifying database to create it if it doesn't exist
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await connection.query(`USE \`${process.env.DB_NAME}\`;`);

    // Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(400) NOT NULL,
        role ENUM('SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER') NOT NULL DEFAULT 'NORMAL_USER',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Stores Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        address VARCHAR(400) NOT NULL,
        owner_id INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // Ratings Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        store_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY user_store_unique (user_id, store_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
      );
    `);

    // Check if System Admin exists, if not create default Admin
    const [rows] = await connection.query('SELECT * FROM users WHERE role = "SYSTEM_ADMIN" LIMIT 1');
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await connection.query(
        'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
        ['System Administrator Account', 'admin@system.com', hashedPassword, 'System Administrator Default Address Headquarters', 'SYSTEM_ADMIN']
      );
      console.log('Default System Admin created: admin@system.com / Admin@123');
    }

    console.log('Database tables created successfully.');
  } catch (error) {
    console.error('Error initializing database schema:', error);
  } finally {
    if (connection) await connection.end();
  }
}

module.exports = initDB;