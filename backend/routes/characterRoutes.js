const express = require('express');
const pool = require('../db/db');
const router = express.Router();

router.get('/', async (req, res) => {
    const { userId } = req.query;
    try {
        const result = await pool.query(
            'SELECT * FROM character WHERE profile_id = $1',
            [userId]
        );
        res.json({ characters: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM character WHERE character_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Character not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post("/:characterId/bulk-add", async (req, res) => {
    const { items } = req.body; // Array of items with character_id, item_id, quantity, and location_id
  
    try {
      const insertQueries = items.map(
        (item) =>
          pool.query(
            `INSERT INTO inventory (character_id, item_id, quantity, location_id)
             VALUES ($1, $2, $3, $4)`,
            [item.character_id, item.item_id, item.quantity, item.location_id]
          )
      );
  
      await Promise.all(insertQueries);
      res.json({ success: true });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });
  

module.exports = router;
