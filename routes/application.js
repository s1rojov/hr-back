const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

router.post('/getCheckAppByHead', async (req, res) => {
    try {
        const { head_id } = req.body;
        const application = await pool.query(`
            SELECT 
                application.*, 
                leadership.fullname AS leader,
                employee.fullname AS employee
            FROM application 
            LEFT JOIN leadership ON application.leader_id = leadership.id
            LEFT JOIN employee ON application.user_unique_code = employee.unique_code
            WHERE application.head_id = $1
        `, [head_id]);
        res.status(200).json(application.rows);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching applications', error: error.message });
    }
});



// const { param, body, validationResult } = require('express-validator');

router.post('/getCheckAppByHead/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { head_id } = req.body;
        const application = await pool.query(`
                SELECT 
                    application.*, 
                    leadership.fullname AS leader,
                    employee.fullname AS employee
                FROM application 
                LEFT JOIN leadership ON application.leader_id = leadership.id
                LEFT JOIN employee ON application.user_unique_code = employee.unique_code
                WHERE application.head_id = $1 AND application.id = $2
            `, [head_id, id]);
        res.status(200).json(application.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching applications', error: error.message });
    }
}
);




router.post('/getCheckAppByHead', async (req, res) => {
    try {

    } catch (error) {

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

router.post('/all', async (req, res) => {
    try {
        const { user_unique_code } = req.body
        const selectedApps = await pool.query('select * from application where user_unique_code = $1', [user_unique_code])
        res.status(200).json(selectedApps.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/allAppForLead', async (req, res) => {
    try {
        const { leader_id } = req.body;
        const application = await pool.query(`
            SELECT 
                application.*, 
                leadership.fullname AS leader,
                employee.fullname AS employee
            FROM application 
            LEFT JOIN leadership ON application.leader_id = leadership.id
            LEFT JOIN employee ON application.user_unique_code = employee.unique_code
            WHERE application.leader_id = $1
        `, [leader_id]);
        res.status(200).json(application.rows);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching applications', error: error.message });
    }
});

router.post('/allAppForLead/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { leader_id } = req.body;
        const application = await pool.query(`
            SELECT 
                application.*, 
                leadership.fullname AS leader,
                employee.fullname AS employee
            FROM application 
            LEFT JOIN leadership ON application.leader_id = leadership.id
            LEFT JOIN employee ON application.user_unique_code = employee.unique_code
            WHERE application.leader_id = $1 and application.id = $2
        `, [leader_id, id]);
        res.status(200).json(application.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching applications', error: error.message });
    }
});

//get by id
router.post('/all/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { user_unique_code } = req.body;

        const selectedApps = await pool.query(`
            SELECT 
                application.*, 
                leadership.fullname AS leader, 
                employee.fullname AS head
            FROM    
                application
            LEFT JOIN 
                leadership ON application.leader_id = leadership.id
            LEFT JOIN 
                employee ON application.head_id = employee.id
            WHERE 
                application.user_unique_code = $1 AND application.id = $2
        `, [user_unique_code, id]);

        res.status(200).json(selectedApps.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//confirm head
router.put('/confirmHead/:id', async (req, res) => {
    try {
        const { agree_head } = req.body
        const { id } = req.params
        const confirmApp = await pool.query(`
            update application set agree_head = $1 where id=$2 returning *
            `,
            [
                agree_head || confirmApp.rows[0].agree_head,
                id
            ]
        )
        res.status(200).json(confirmApp.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/confirmLead/:id', async (req, res) => {
    try {
        const { agree_leader } = req.body
        const { id } = req.params
        const confirmApp = await pool.query(`
            update application set agree_leader = $1 where id=$2 returning *
            `,
            [
                agree_leader || confirmApp.rows[0].agree_leader,
                id
            ]
        )
        res.status(200).json(confirmApp.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})



router.get('/allAppForHr', async (req, res) => {
    try {
        const app = await pool.query (`
            SELECT 
                application.*, 
                leadership.fullname AS leader, 
                employee.fullname AS head
            FROM    
                application
            LEFT JOIN 
                leadership ON application.leader_id = leadership.id
            LEFT JOIN 
                employee ON application.head_id = employee.id
            `)

        res.status(200).json(app.rows)
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

module.exports = router