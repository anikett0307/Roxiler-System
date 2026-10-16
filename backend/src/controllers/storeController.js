const db = require('../config/db');

// 1. Get Stores for Normal Users (Search, Sort, Community Rating + Submitted Rating)
exports.getStoresForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search = '', sortBy = 'name', sortOrder = 'ASC' } = req.query;

    const validSortColumns = ['name', 'address'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
    const direction = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const searchPattern = `%${search.trim()}%`;

    const query = `
      SELECT 
        s.id, 
        s.name, 
        s.address, 
        ROUND(COALESCE(AVG(r.rating), 0), 2) AS overall_rating,
        (
          SELECT rating 
          FROM ratings 
          WHERE user_id = ? AND store_id = s.id 
          LIMIT 1
        ) AS user_submitted_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE (s.name LIKE ? OR s.address LIKE ?)
      GROUP BY s.id
      ORDER BY s.${sortColumn} ${direction}
    `;

    const [stores] = await db.query(query, [userId, searchPattern, searchPattern]);
    res.json(stores);
  } catch (error) {
    console.error('Error in getStoresForUser:', error);
    res.status(500).json({ message: 'Failed to retrieve store listings.' });
  }
};

// 2. Get Store Owner Dashboard Metrics & User Breakdown
exports.getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Find the store owned by this user
    const [stores] = await db.query('SELECT id, name, address FROM stores WHERE owner_id = ?', [ownerId]);

    if (stores.length === 0) {
      return res.status(200).json({
        storeName: 'No Store Assigned',
        address: 'N/A',
        averageRating: '0.00',
        raters: []
      });
    }

    const store = stores[0];

    // Calculate store average rating
    const [[ratingData]] = await db.query(
      'SELECT ROUND(COALESCE(AVG(rating), 0), 2) AS avgRating FROM ratings WHERE store_id = ?',
      [store.id]
    );

    // Get list of users who submitted ratings for this store
    const [raters] = await db.query(
      `SELECT 
        u.name, 
        u.email, 
        r.rating, 
        r.updated_at 
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.updated_at DESC`,
      [store.id]
    );

    res.json({
      storeName: store.name,
      address: store.address,
      averageRating: ratingData.avgRating,
      raters
    });
  } catch (error) {
    console.error('Error in getOwnerDashboard:', error);
    res.status(500).json({ message: 'Failed to retrieve store owner analytics.' });
  }
};
// Implement store listing with search and sorting, community ratings, user-submitted ratings, and store owner analytics APIs.