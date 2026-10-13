const db = require('../config/db');

// Submit or Modify Rating (Atomic Insert/Update with 1-5 validation)
exports.submitOrUpdateRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId, rating } = req.body;

    // Boundary check for integer rating between 1 and 5
    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer value between 1 and 5.' });
    }

    // Verify store exists
    const [stores] = await db.query('SELECT id FROM stores WHERE id = ?', [storeId]);
    if (stores.length === 0) {
      return res.status(404).json({ message: 'Target store does not exist.' });
    }

    // Atomic insert or update existing user rating for the target store
    const query = `
      INSERT INTO ratings (user_id, store_id, rating)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP
    `;

    await db.query(query, [userId, storeId, numericRating]);

    res.json({ message: 'Rating saved successfully.' });
  } catch (error) {
    console.error('Error in submitOrUpdateRating:', error);
    res.status(500).json({ message: 'An error occurred while saving your rating.' });
  }
};