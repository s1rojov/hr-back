const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

//get all directorys

router.get('/', async(req, res)=>{
    try {
        const directorys =await pool.query('select * from directory')
        res.status(200).send(directorys.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//add directory
router.post('/', async (req, res) => {
    try {
        const { id, fullname, shortname, faculty_id } = req.body
        const newDirectory = await pool.query(
            `insert into directory (id, fullname, shortname, faculty_id) values ($1, $2, $3, $4) returning *`,
            [id, fullname, shortname, faculty_id]
        );
        res.status(201).json(newDirectory.rows);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//update directory
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, shortname, faculty_id } = req.body
        const directoryById = await pool.query('SELECT * FROM directory WHERE id = $1', [id]);
        const updatedDirectory = await pool.query(
            `update directory set fullname = $1, shortname = $2, faculty_id = $3 where id = $4 returning *`,
            [
                fullname || directoryById.rows[0].fullname,
                shortname || directoryById.rows[0].shortname,
                faculty_id || directoryById.rows[0].org_id,
                id
            ]
        );
        res.status(200).json(updatedDirectory.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//delete directory
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('delete from directory where id= $1', [req.params.id])
        res.status(200).json('Deleted successfully')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})


module.exports = router