const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

//get all types

router.get('/', async(req, res)=>{
    try {
        const employee_type = await pool.query('select * from employee_type')
        res.status(200).send(employee_type.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//add type
router.post('/', async (req, res) => {
    try {
        const { id, name, count, directory_id } = req.body
        const newType = await pool.query(
            `insert into employee_type (id, name, count, directory_id) values ($1, $2, $3, $4) returning *`,
            [id, name, count, directory_id]
        );
        res.status(201).json(newType.rows);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//update type
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { name, count, directory_id } = req.body
        const typeById = await pool.query('SELECT * FROM employee_type WHERE id = $1', [id]);
        const updatedType = await pool.query(
            `update employee_type set name = $1, count = $2, directory_id = $3 where id = $4 returning *`,
            [
                name || typeById.rows[0].name,
                count || typeById.rows[0].count,
                directory_id || typeById.rows[0].directory_id,
                id
            ]
        );
        res.status(200).json(updatedType.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//delete type
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('delete from employee_type where id= $1', [req.params.id])
        res.status(200).json('Deleted successfully')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})


module.exports = router