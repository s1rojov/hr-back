const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

//get all admins

router.get('/', async(req, res)=>{
    try {
        const admins =await pool.query('select * from admin')
        res.status(200).send(admins.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//add admin
router.post('/', async (req, res) => {
    try {
        const { id, fullname, login, password, org_id } = req.body
        const newAdmin = await pool.query(
            `insert into admin (id, fullname, login, password, org_id) values ($1, $2, $3, $4, $5) returning *`,
            [id,fullname, login, password, org_id]
        );
        res.status(201).json(newAdmin.rows);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//update admin
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, login, password, org_id } = req.body
        const adminById = await pool.query('SELECT * FROM admin WHERE id = $1', [id]);
        const updatedAdmin = await pool.query(
            `update admin set fullname = $1, login = $2, password = $3, org_id = $4 where id = $5 returning *`,
            [
                fullname || adminById.rows[0].fullname,
                login || adminById.rows[0].login,
                password || adminById.rows[0].password,
                org_id || adminById.rows[0].org_id,
                id
            ]
        );
        res.status(200).json(updatedAdmin.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//delete directory
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('delete from admin where id= $1', [req.params.id])
        res.status(200).json('Deleted successfully')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})


module.exports = router