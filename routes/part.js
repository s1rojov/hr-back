const { Router } = require("express");
const pool = require("../config/db");
const router = Router();



//get all organization parts
router.get('/', async (req, res) => {
    try {
        const parts = await pool.query('select * from part')
        res.status(200).json(parts.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//add part
router.post('/', async (req, res) => {
    try {
        const { id, fullname, shortname, org_id } = req.body
        const newOrg = await pool.query(
            `insert into part (id, fullname, shortname, org_id) values ($1, $2, $3, $4) returning *`,
            [id, fullname, shortname, org_id]
        );
        res.status(201).json('Created successfully');
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//update part
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, shortname, org_id } = req.body
        const partById = await pool.query('SELECT * FROM part WHERE id = $1', [id]);
        const updatedPart = await pool.query(
            `update part set fullname = $1, shortname = $2, org_id = $3 where id = $4 returning *`,
            [
                fullname || partById.rows[0].fullname,
                shortname || partById.rows[0].shortname,
                org_id || partById.rows[0].org_id,
                id
            ]
        );
        res.status(200).json(updatedPart.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//delete part
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('delete from part where id= $1', [req.params.id])
        res.status(200).json('Deleted successfully')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})


module.exports = router