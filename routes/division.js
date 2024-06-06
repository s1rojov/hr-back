const { Router } = require("express");
const pool = require("../config/db");
const router = Router();



//get all
router.get('/', async (req, res) => {
    try {
        const division = await pool.query('select * from division')
        res.status(200).json(division.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//add
router.post('/', async (req, res) => {
    try {
        const {fullname, shortname } = req.body
        const newDivision =  await pool.query(
            `insert into division (fullname, shortname) values ($1, $2) returning *`,
            [fullname, shortname]
        );
        res.status(201).json(newDivision.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//update
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, shortname } = req.body
        const divisionById = await pool.query('SELECT * FROM division WHERE id = $1', [id]);
        const updateddivision = await pool.query(
            `update division set fullname = $1, shortname = $2 where id = $3 returning *`,
            [
                fullname || divisionById.rows[0].fullname,
                shortname || divisionById.rows[0].shortname,
                id
            ]
        );
        res.status(200).json(updateddivision.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//get by id
router.get('/:id', async(req, res)=>{
    try {
        const { id } = req.params
        const division = await pool.query('SELECT * FROM division WHERE id = $1', [id]);
        res.status(200).json(division.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//delete faculty
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('delete from division where id= $1', [req.params.id])
        res.status(200).json('Deleted successfully')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})


module.exports = router