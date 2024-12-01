const express = require('express');
const pool = require('../db/db');
const router = express.Router();

router.get('/:characterId/items', async (req, res) => {
    const { characterId } = req.params;
    try {
        const result = await pool.query(
            `SELECT i.*, itm.item_name, itm.item_category, loc.location_id, loc.location_name 
             FROM inventory i
             JOIN item itm ON i.item_id = itm.item_id
             JOIN location loc ON i.location_id = loc.location_id
             WHERE i.character_id = $1`,
            [characterId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// Add item to inventory
router.post('/:characterId/add', async (req, res) => {
    const { characterId } = req.params;
    const { itemId, quantity, locationId } = req.body;
    try {
        await pool.query(
            'INSERT INTO inventory (character_id, item_id, quantity, location_id) VALUES ($1, $2, $3, $4)',
            [characterId, itemId, quantity, locationId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Fetch all items
router.get('/allItems', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM item');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Fetch locations for a character
router.get('/locations/:characterId', async (req, res) => {
    const { characterId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM location WHERE character_id = $1',
            [characterId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
