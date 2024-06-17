const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

//get all

router.get('/', async(req, res)=>{
    try {
        const employee_type = await pool.query('SELECT e.id, e.name, e.count, k.fullname AS kafedra, d.fullname AS department FROM employee_type e LEFT JOIN  kafedra k ON e.kafedra_id = k.id LEFT JOIN department d ON e.department_id = d.id;')
        res.status(200).send(employee_type.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//add type
router.post('/', async (req, res) => {
    try {
        const { name, count, kafedra_id, department_id } = req.body
        const newType = await pool.query(
            `insert into employee_type (name, count, kafedra_id,department_id ) values ($1, $2, $3, $4) returning *`,
            [name, count, kafedra_id,department_id ]
        );
        res.status(201).json(newType.rows);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// //update type
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { name, count, kafedra_id, department_id } = req.body
        const typeById = await pool.query('SELECT * FROM employee_type WHERE id = $1', [id]);
        const updatedType = await pool.query(
            `update employee_type set name = $1, count = $2, kafedra_id = $3, department_id = $4  where id = $5 returning *`,
            [
                name || typeById.rows[0].name,
                count || typeById.rows[0].count,
                kafedra_id || typeById.rows[0].kafedra_id,
                department_id || typeById.rows[0].department_id,
                id
            ]
        );
        res.status(200).json(updatedType.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/kafedraList', async(req, res)=>{
    try {
        const kafedraList = await pool.query('SELECT id AS value, fullname AS label FROM kafedra;')
        res.status(200).send(kafedraList.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.get('/departmentList', async(req, res)=>{
    try {
        const departmentList = await pool.query('SELECT id AS value, fullname AS label FROM department;')
        res.status(200).send(departmentList.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//get by id
router.get('/:id', async(req, res)=>{
    try {
        const { id } = req.params
        const type = await pool.query('SELECT * FROM employee_type WHERE id = $1', [id]);
        res.status(200).json(type.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// //delete type
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('delete from employee_type where id= $1', [req.params.id])
        res.status(200).json('Deleted successfully')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})


module.exports = router