const db = require('../config/db');
const bcrypt = require('bcryptjs');

// 1. Get Dashboard Analytics Metrics
exports.getDashboardStats = async (req, res) => {
  try {
    const [[usersCount]] = await db.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[storesCount]] = await db.query('SELECT COUNT(*) AS totalStores FROM stores');
    const [[ratingsCount]] = await db.query('SELECT COUNT(*) AS totalRatings FROM ratings');

    res.json({
      totalUsers: usersCount.totalUsers || 0,
      totalStores: storesCount.totalStores || 0,
      totalRatings: ratingsCount.totalRatings || 0,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard stats.' });
  }
};

// 2. Add New User (Normal User, Store Owner, or Admin)
exports.addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = role || 'NORMAL_USER';

    await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, assignedRole]
    );

    res.status(201).json({ message: `${assignedRole} created successfully.` });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Server error while adding user.' });
  }
};

// 3. Get All Users (Includes Store Owner's Store Rating if applicable + Full Filters & Sorting)
exports.getUsers = async (req, res) => {
  try {
    const { search = '', role = '', sortBy = 'name', sortOrder = 'ASC' } = req.query;

    const validSortColumns = ['name', 'email', 'address', 'role'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
    const direction = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.address, 
        u.role,
        s.name AS store_name,
        COALESCE(AVG(r.rating), 0) AS store_rating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE (u.name LIKE ? OR u.email LIKE ? OR u.address LIKE ?)
    `;

    const queryParams = [`%${search}%`, `%${search}%`, `%${search}%`];

    if (role) {
      query += ` AND u.role = ?`;
      queryParams.push(role);
    }

    query += ` GROUP BY u.id, s.id ORDER BY u.${sortColumn} ${direction}`;

    const [users] = await db.query(query, queryParams);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users list.' });
  }
};

// 4. Add New Store
exports.addStore = async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  try {
    const [existing] = await db.query('SELECT id FROM stores WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Store with this email already exists.' });
    }

    await db.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, ownerId || null]
    );

    res.status(201).json({ message: 'Store created successfully.' });
  } catch (error) {
    console.error('Error adding store:', error);
    res.status(500).json({ message: 'Server error while adding store.' });
  }
};

// 5. Get All Stores with Rating, Email, Address, and Filters
exports.getStores = async (req, res) => {
  try {
    const { search = '', sortBy = 'name', sortOrder = 'ASC' } = req.query;

    const validSortColumns = ['name', 'email', 'address'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
    const direction = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const query = `
      SELECT 
        s.id, 
        s.name, 
        s.email, 
        s.address, 
        COALESCE(AVG(r.rating), 0) AS overall_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE (s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?)
      GROUP BY s.id
      ORDER BY s.${sortColumn} ${direction}
    `;

    const searchPattern = `%${search}%`;
    const [stores] = await db.query(query, [searchPattern, searchPattern, searchPattern]);

    res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Server error while fetching stores list.' });
  }
};