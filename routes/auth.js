const { Router } = require("express");
const pool = require("../config/db");
const router = Router();



// get access system

router.post('/', async (req, res) => {
    try {
        const { login, password } = req.body
        let employee = ''
        let hr = ''
        let data = {
            user: '',
            employee: false,
            hr: false,
            access: false
        }
        if (login == '') {
            employee = await pool.query('select * from employee where unique_code = $1', [password])
            if (employee.rows.length != 0) {
                data.user = employee.rows[0];
                data.employee = true
                data.access = true
                res.status(200).send(data)
            }
            else {
                res.status(404).send(data)
            }
        } else {
            hr = await pool.query('SELECT * FROM admin WHERE login = $1 AND password = $2', [login, password]);
            if (hr.rows.length != 0) {
                data.user = hr.rows[0];
                data.hr = true
                data.access = true
                res.status(200).send(data)
            }
            else {
                res.status(404).send(data)
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


router.post('/leadership', async (req, res) => {
    try {
        const { unique_code } = req.body;
        let data = {
            user: '',
            employee: false,
            hr: false,
            access: false
        };
        const leader = await pool.query('SELECT * FROM leadership WHERE unique_code = $1', [unique_code]);
        if (leader.rows.length !== 0) {
            data.user = leader.rows[0];
            data.employee = true;
            data.access = true;
            res.status(200).send(data);
        } else {
            res.status(404).send({ message: "Ma'lumot topilmadi" });
        }
        // res.status(200).json(leader.rows);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching leadership data', error: error.message });
    }
});


// router.post('/employee', async (req, res) => {
//     try {
//         const { unique_code } = req.body
//         const isEmployee = await pool.query('select * from employee where unique_code = $1', [unique_code])
//         if (isEmployee.rows.length != 0) {
//             const data = {
//                 user: isEmployee.rows[0],
//                 employee: true
//             }
//             res.status(200).send(data)
//         }
//         else {
//             const data = {
//                 user: isEmployee.rows[0],
//                 employee: false
//             }
//             res.status(404).send(data)
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }

// })




module.exports = router