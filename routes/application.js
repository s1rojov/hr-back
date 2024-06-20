const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

router.get('/', async (req, res) => {
    try {
        const application = await pool.query('select * from application')
        res.status(200).json(application.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

router.post('/', async (req, res) => {
    try {
        const { leader_id, head_id, dateOn, dateEnd, agree_head, agree_leader, agree_hr, user_unique_code, app_type } = req.body
        const newApp = await pool.query(`
            insert into application (leader_id, head_id, dateOn, dateEnd, agree_head, agree_leader, agree_hr, user_unique_code, app_type) values ($1,$2, $3, $4, $5, $6, $7, $8, $9) returning * `,
        [leader_id, head_id, dateOn, dateEnd, agree_head, agree_leader, agree_hr, user_unique_code, app_type])
        res.status(201).json(newApp.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/all', async(req, res)=>{
    try {
        const {user_unique_code} = req.body
        const selectedApps = await pool.query('select * from application where user_unique_code = $1', [user_unique_code])
        res.status(200).json(selectedApps.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
    
})

module.exports = router