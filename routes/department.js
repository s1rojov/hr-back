const { Router } = require("express");
const pool = require("../config/db");
const router = Router();



//get all
router.get('/', async (req, res) => {
    try {
        const department = await pool.query('select * from department')
        res.status(200).json(department.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


//get by id
router.get('/:id', async(req, res)=>{
    try {
        const { id } = req.params
        const department = await pool.query('SELECT * FROM department WHERE id = $1', [id]);
        res.status(200).json(department.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//add
router.post('/', async (req, res) => {
    try {
        const {fullname, shortname } = req.body
        const newDepartment =  await pool.query(
            `insert into department (fullname, shortname) values ($1, $2) returning *`,
            [fullname, shortname]
        );
        res.status(201).json(newDepartment.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//update
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, shortname } = req.body
        const departmentById = await pool.query('SELECT * FROM division WHERE id = $1', [id]);
        const updatedDepartment = await pool.query(
            `update department set fullname = $1, shortname = $2 where id = $3 returning *`,
            [
                fullname || departmentById.rows[0].fullname,
                shortname || departmentById.rows[0].shortname,
                id
            ]
        );
        res.status(200).json(updatedDepartment.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//delete faculty
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('delete from department where id= $1', [req.params.id])
        res.status(200).json('Deleted successfully')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})


module.exports = router