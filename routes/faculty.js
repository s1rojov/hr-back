const { Router } = require("express");
const pool = require("../config/db");
const router = Router();



//get all organization facultys
router.get('/', async (req, res) => {
    try {
        const facultys = await pool.query('select * from faculty')
        res.status(200).json(facultys.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//add faculty
router.post('/', async (req, res) => {
    try {
        const { id, fullname, shortname, org_id } = req.body
        const newOrg = await pool.query(
            `insert into faculty (id, fullname, shortname, org_id) values ($1, $2, $3, $4) returning *`,
            [id, fullname, shortname, org_id]
        );
        res.status(201).json('Created successfully');
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//update faculty
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, shortname, org_id } = req.body
        const facultyById = await pool.query('SELECT * FROM faculty WHERE id = $1', [id]);
        const updatedfaculty = await pool.query(
            `update faculty set fullname = $1, shortname = $2, org_id = $3 where id = $4 returning *`,
            [
                fullname || facultyById.rows[0].fullname,
                shortname || facultyById.rows[0].shortname,
                org_id || facultyById.rows[0].org_id,
                id
            ]
        );
        res.status(200).json(updatedfaculty.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//delete faculty
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('delete from faculty where id= $1', [req.params.id])
        res.status(200).json('Deleted successfully')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})


module.exports = router