const { Router } = require("express");
const pool = require("../config/db");
const router = Router();



//get all organization facultys
router.get('/', async (req, res) => {
    try {
        const employees = await pool.query('select * from employee')
        res.status(200).json(employees.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//add faculty
router.post('/', async (req, res) => {
    try {
        const { fullname, phone, address, birthday, pass_information, experience, kafedra_id, department_id, employee_type_id, shtat, unique_code } = req.body
        const newEmployee = await pool.query(
            `insert into employee (fullname,phone, address, birthday, pass_information, experience, kafedra_id, department_id, employee_type_id, shtat, unique_code ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *`,
            [fullname, phone, address, birthday, pass_information, experience, kafedra_id, department_id, employee_type_id, shtat, unique_code]
        );
        res.status(201).json(newEmployee.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// //update faculty
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, phone, address, birthday, pass_information, experience, kafedra_id, department_id, employee_type_id, shtat, unique_code } = req.body
        const employeeById = await pool.query('SELECT * FROM employee WHERE id = $1', [id]);
        const updatedEmployee = await pool.query(
            `update employee set fullname =$1, phone =$2, address=$3, birthday =$4, pass_information =$5, experience =$6, kafedra_id=$7, department_id=$8, employee_type_id=$9, shtat=$10, unique_code =$11 where id = $12 returning *`,
            [
                fullname || employeeById.rows[0].fullname,
                phone || employeeById.rows[0].phone,
                address || employeeById.rows[0].address,
                birthday || employeeById.rows[0].birthday,
                pass_information || employeeById.rows[0].pass_information,
                experience || employeeById.rows[0].experience,
                kafedra_id || employeeById.rows[0].kafedra_id,
                department_id || employeeById.rows[0].department_id,
                employee_type_id || employeeById.rows[0].employee_type_id,
                shtat || employeeById.rows[0].shtat,
                unique_code || employeeById.rows[0].unique_code,
                id
            ]
        );
        res.status(200).json(updatedEmployee.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// //delete faculty
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('delete from employee where id= $1', [req.params.id])
        res.status(200).json('Deleted successfully')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})


module.exports = router