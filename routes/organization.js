const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

// all logic here
router.get('/', async (req, res) => {
    const organizations = await pool.query('select * from organization')
    res.status(200).json(organizations.rows)
})

module.exports = router