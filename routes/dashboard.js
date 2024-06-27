const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

router.get('/', async (req, res) => {
    try {
        const vacansy = await pool.query(`
            SELECT 
                et.name AS position,
                et.count - COUNT(e.id) AS vacancies
                FROM 
                employee_type et
                LEFT JOIN 
                employee e ON et.id = e.employee_type_id
                GROUP BY 
                et.id;
            `)
        const divisions = await pool.query(`
            
            SELECT 
    COUNT(*) AS total_divisions
FROM 
    division;
            `)

        const departments = await pool.query(`
            SELECT 
    COUNT(*) AS total_departments
FROM 
    department;
        `)

        const kefedras = await pool.query(`
            SELECT 
    COUNT(*) AS total_kafedras
FROM 
    kafedra;

            `)
        const leaders = await pool.query(`
                    SELECT 
        COUNT(*) AS total_leadership_employees
    FROM 
        leadership;
                `)

        const employees = await pool.query(`
                SELECT 
    COUNT(*) AS total_employees
FROM 
    employee;
                `)

        const data = {
            vacansy: vacansy.rows,
            divisions: divisions.rows[0],
            departments: departments.rows[0],
            kefedras: kefedras.rows[0],
            leaders: leaders.rows[0],
            employees: employees.rows[0]
        }

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


module.exports = router