const bcrypt = require('bcryptjs');
const db = require('./db');
const sampleData = require('./sampleData.json');

const seedDB = async () => {
  try {
    // 1. Safe reset of tables to prevent primary key collisions during re-seeding
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.query('TRUNCATE TABLE ratings');
    await db.query('TRUNCATE TABLE stores');
    await db.query('TRUNCATE TABLE users');
    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    // 2. Seed Users from sampleData.json
    for (const u of sampleData.users) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      await db.query(
        `INSERT INTO users (id, name, email, password, address, role) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [u.id, u.name, u.email, hashedPassword, u.address, u.role]
      );
    }

    // 3. Seed Stores from sampleData.json
    for (const s of sampleData.stores) {
      await db.query(
        `INSERT INTO stores (id, name, email, address, owner_id) 
         VALUES (?, ?, ?, ?, ?)`,
        [s.id, s.name, s.email, s.address, s.owner_id]
      );
    }

    // 4. Seed Ratings from sampleData.json (Populates dashboard metrics and ratings)
    if (sampleData.ratings && sampleData.ratings.length > 0) {
      for (const r of sampleData.ratings) {
        await db.query(
          `INSERT INTO ratings (user_id, store_id, rating) 
           VALUES (?, ?, ?)`,
          [r.user_id, r.store_id, r.rating]
        );
      }
    }

    console.log('✅ Database successfully seeded dynamically from sampleData.json.');
  } catch (err) {
    console.error('❌ Error seeding database from sample data:', err.message);
  }
};

module.exports = seedDB;