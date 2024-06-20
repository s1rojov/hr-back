const { Router } = require("express");
const pool = require("../config/db");
const router = Router();


router.get('/getList', async(req, res)=>{
    try {
        const kafedraList = await pool.query('select id as value, fullname as label from employee where is_head = true')
        res.status(200).send(kafedraList.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

//get all 
router.get('/', async (req, res) => {
    try {
        const department_heads = await pool.query(`    
            SELECT 
            dh.id,
            dh.fullname,
            dh.phone,
            dh.address,
            dh.birthday,
            dh.pass_information,
            dh.experience,
            k.fullname AS kafedra,
            d.fullname AS department,
            dh.unique_code,
            dh.updated_at,
            dh.created_at
            FROM 
            department_head dh
            LEFT JOIN 
            kafedra k ON  dh.kafedra_id = k.id
            LEFT JOIN 
            department d ON dh.department_id = d.id
`)
        res.status(200).json(department_heads.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// router.get('/positionList', async (req, res) => {
//     try {
//         const positionList = await pool.query('SELECT e.id, e.name, k.fullname AS kafedra, d.fullname AS department FROM employee_type e LEFT JOIN  kafedra k ON e.kafedra_id = k.id LEFT JOIN department d ON e.department_id = d.id;');
//         let newList = []
//         positionList.rows.forEach(item => {
//             newList.push({
//                 value: item.id,
//                 label: item.kafedra ? `${item.name} - ${item.kafedra}` : `${item.name} - ${item.department}`
//             })
//         })
//         res.status(200).send(newList)
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

//add
router.post('/', async (req, res) => {
    try {
        const { fullname, phone, address, birthday, pass_information, experience, department_id, kafedra_id, unique_code } = req.body
        const department_head = await pool.query(
            `insert into department_head (fullname ,phone, address, birthday, pass_information, experience, department_id, kafedra_id, unique_code ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,
            [fullname, phone, address, birthday, pass_information, experience, department_id, kafedra_id, unique_code]
        );
        res.status(201).json(department_head.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// get by id
    router.get('/:id', async(req, res)=>{
        try {
            const { id } = req.params
            const division = await pool.query('SELECT * FROM department_head WHERE id = $1', [id]);
            res.status(200).json(division.rows[0])
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    })


// router.get('/get/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const division = await pool.query(`
//             SELECT 
//     dh.id,
//     dh.fullname,
//     dh.phone,
//     dh.address,
//     dh.birthday,
//     dh.pass_information,
//     dh.experience,
//     k.fullname AS kafedra,
//     d.fullname AS department,
//     dh.unique_code,
//     dh.updated_at,
//     dh.created_at
// FROM 
//     department_head dh
// JOIN 
//     kafedra k ON dh.kafedra_id = k.id
// JOIN 
//     department d ON dh.department_id = d.id
//     where dh.id = $1
//     ;
//             `, [id]);
//         res.status(200).json(division.rows[0]);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });



// //update
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, phone, address, birthday, pass_information, experience, kafedra_id, department_id, unique_code } = req.body
        const employeeById = await pool.query('SELECT * FROM employee WHERE id = $1', [id]);
        const updatedEmployee = await pool.query(
            `update department_head set fullname =$1, phone =$2, address=$3, birthday =$4, pass_information =$5, experience =$6, department=$7, kafedra_id=$8, unique_code =$9 where id = $10 returning *`,
            [
                fullname || employeeById.rows[0].fullname,
                phone || employeeById.rows[0].phone,
                address || employeeById.rows[0].address,
                birthday || employeeById.rows[0].birthday,
                pass_information || employeeById.rows[0].pass_information,
                experience || employeeById.rows[0].experience,
                department_id || employeeById.rows[0].department_id,
                kafedra_id || employeeById.rows[0].kafedra_id,
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
        await pool.query('delete from department_head where id= $1', [req.params.id])
        res.status(200).json('Deleted successfully')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})


module.exports = router