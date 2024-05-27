const { Router } = require("express");
const pool = require("../config/db");
const router = Router();



// get access system

router.post('/', async(req, res)=>{
    try {
        const { login, password } = req.body
        const isAdmin = await pool.query('SELECT * FROM admin WHERE login = $1 AND password = $2', [login, password]);
        if(isAdmin.rows.length !=0){
            const data = {
                admin:isAdmin.rows[0],
                access: true
            }
            res.status(200).send(data)
        }
        else{
            
            const data = {
                admin:isAdmin.rows[0],
                access: false
            }
            res.status(404).send(data)
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})




module.exports = router