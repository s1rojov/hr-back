const { Router } = require("express");
const pool = require("../config/db");
const router = Router();



//get all organization parts
router.get('/', async (req, res) => {
    try {
        const employees = await pool.query('select * from employee')
        res.status(200).json(employees.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//add part
router.post('/', async (req, res) => {
    try {
        const { id, fullname, type_id, is_teacher, section_id } = req.body
        const newEmployee = await pool.query(
            `insert into employee (id, fullname, type_id, is_teacher, section_id) values ($1, $2, $3, $4, $5) returning *`,
            [id, fullname, type_id, is_teacher, section_id]
        );
        res.status(201).json(newEmployee.rows);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//update part
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, type_id, is_teacher, section_id } = req.body
        const employeeById = await pool.query('SELECT * FROM employee WHERE id = $1', [id]);
        const updatedEmployee = await pool.query(
            `update employee set fullname = $1, type_id = $2, is_teacher = $3, section_id = $4 where id = $5 returning *`,
            [
                fullname || employeeById.rows[0].fullname,
                type_id || employeeById.rows[0].type_id,
                is_teacher || employeeById.rows[0].is_teacher,
                section_id || employeeById.rows[0].section_id,
                id
            ]
        );
        res.status(200).json(updatedEmployee.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//delete part
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('delete from employee where id= $1', [req.params.id])
        res.status(200).json('Deleted successfully')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})


module.exports = router