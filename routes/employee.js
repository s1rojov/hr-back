const { Router } = require("express");
const pool = require("../config/db");
const router = Router();



//get all 
router.get('/', async (req, res) => {
    try {
        const employees = await pool.query(`
            
            SELECT 
    e.id, 
    e.fullname, 
    e.phone, 
    e.address, 
    e.birthday, 
    e.pass_information, 
    e.experience, 
    e.shtat, 
    e.unique_code, 
    e.created_at, 
    e.updated_at, 
    et.name AS position, 
    d.fullname AS department, 
    k.fullname AS kafedra, 
    div.fullname AS division
FROM 
    employee e
LEFT JOIN 
    employee_type et ON e.employee_type_id = et.id
LEFT JOIN 
    kafedra k ON et.kafedra_id = k.id
LEFT JOIN 
    department d ON et.department_id = d.id
LEFT JOIN 
    division div ON k.division_id = div.id
ORDER BY 
    e.id;

            
            `)
        res.status(200).json(employees.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


router.get('/positionList', async (req, res) => {
    try {
        const positionList = await pool.query('SELECT e.id, e.name, k.fullname AS kafedra, d.fullname AS department FROM employee_type e LEFT JOIN  kafedra k ON e.kafedra_id = k.id LEFT JOIN department d ON e.department_id = d.id;');
        let newList = []
        positionList.rows.forEach(item => {
            newList.push({
                value: item.id,
                label: item.kafedra ? `${item.name} - ${item.kafedra}` : `${item.name} - ${item.department}`
            })
        })
        res.status(200).send(newList)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//add
router.post('/', async (req, res) => {
    try {
        const { fullname, phone, address, birthday, pass_information, experience, employee_type_id, shtat, unique_code } = req.body
        const newEmployee = await pool.query(
            `insert into employee (fullname,phone, address, birthday, pass_information, experience, employee_type_id, shtat, unique_code ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,
            [fullname, phone, address, birthday, pass_information, experience, employee_type_id, shtat, unique_code]
        );
        res.status(201).json(newEmployee.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// get by id
router.get('/:id', async(req, res)=>{
    try {
        const { id } = req.params
        const division = await pool.query('SELECT * FROM employee WHERE id = $1', [id]);
        res.status(200).json(division.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// //update
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, phone, address, birthday, pass_information, experience, employee_type_id, shtat, unique_code } = req.body
        const employeeById = await pool.query('SELECT * FROM employee WHERE id = $1', [id]);
        const updatedEmployee = await pool.query(
            `update employee set fullname =$1, phone =$2, address=$3, birthday =$4, pass_information =$5, experience =$6, employee_type_id=$7, shtat=$8, unique_code =$9 where id = $10 returning *`,
            [
                fullname || employeeById.rows[0].fullname,
                phone || employeeById.rows[0].phone,
                address || employeeById.rows[0].address,
                birthday || employeeById.rows[0].birthday,
                pass_information || employeeById.rows[0].pass_information,
                experience || employeeById.rows[0].experience,
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