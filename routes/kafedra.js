const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

//get all directorys

router.get('/', async(req, res)=>{
    try {
        const kafedra =await pool.query('select * from kafedra')
        res.status(200).send(kafedra.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//add directory
router.post('/', async (req, res) => {
    try {
        const { fullname, shortname, division_id } = req.body
        const newKafedra = await pool.query(
            `insert into kafedra (fullname, shortname, division_id) values ($1, $2, $3) returning *`,
            [fullname, shortname, division_id]
        );
        res.status(201).json(newKafedra.rows);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//update directory
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, shortname, division_id } = req.body
        const kafedraById = await pool.query('SELECT * FROM kafedra WHERE id = $1', [id]);
        const updatedKafedra = await pool.query(
            `update kafedra set fullname = $1, shortname = $2, division_id = $3 where id = $4 returning *`,
            [
                fullname || kafedraById.rows[0].fullname,
                shortname || kafedraById.rows[0].shortname,
                division_id || kafedraById.rows[0].division_id,
                id
            ]
        );
        res.status(200).json(updatedKafedra.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//delete directory
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('delete from kafedra where id= $1', [req.params.id])
        res.status(200).json('Deleted successfully')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})


module.exports = router