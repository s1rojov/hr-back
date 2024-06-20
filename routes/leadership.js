const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

// get all
router.get('/', async (req, res) => {
    try {
        const getAll = await pool.query('select * from leadership')
        res.status(200).json(getAll.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// getLeadershipList

router.get('/getList', async(req, res)=>{
    try {
        const leadershipList = await pool.query('SELECT id AS value, fullname AS label, position FROM leadership;')
        res.status(200).send(leadershipList.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//get by id
router.get('/:id', async(req, res)=>{
    try {
        const { id } = req.params
        const leadership = await pool.query('SELECT * FROM leadership WHERE id = $1', [id]);
        res.status(200).json(leadership.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// // add new
router.post('/', async (req, res) => {
    try {
        const {fullname, phone, position, address, birthday, pass_information, experience} = req.body
        const newLeader = await pool.query(
            `insert into leadership (fullname, phone, position, address, birthday, pass_information, experience) values ($1, $2, $3, $4, $5, $6, $7) returning *`,
            [fullname, phone, position, address, birthday, pass_information, experience]
        );
        res.status(201).json(newLeader.rows);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// // update
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, phone, position, address, birthday, pass_information, experience } = req.body
        const leaderById = await pool.query('SELECT * FROM leadership WHERE id = $1', [id]);
        const updatedOrg = await pool.query(
            `update leadership set fullname = $1, phone = $2, position = $3, address = $4, birthday = $5, pass_information = $6, experience = $7 where id =$8 returning *`,
            [
                fullname || leaderById.rows[0].fullname,
                phone || leaderById.rows[0].phone,
                position || leaderById.rows[0].position,
                address || leaderById.rows[0].address,
                birthday || leaderById.rows[0].birthday,
                pass_information || leaderById.rows[0].pass_information,
                experience || leaderById.rows[0].experience,
                id
            ]
        );
        res.status(200).json(updatedOrg.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// //delete
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('delete from leadership where id= $1', [req.params.id])
        res.status(200).json('Deleted successfully')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})



module.exports = router