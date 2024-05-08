const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

//get all sections

router.get('/', async(req, res)=>{
    try {
        const sections =await pool.query('select * from section')
        res.status(200).send(sections.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//add section
router.post('/', async (req, res) => {
    try {
        const { id, fullname, shortname, part_id } = req.body
        const newSection = await pool.query(
            `insert into section (id, fullname, shortname, part_id) values ($1, $2, $3, $4) returning *`,
            [id, fullname, shortname, part_id]
        );
        res.status(201).json(newSection.rows);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//update section
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, shortname, part_id } = req.body
        const sectionById = await pool.query('SELECT * FROM section WHERE id = $1', [id]);
        const updatedSection = await pool.query(
            `update section set fullname = $1, shortname = $2, part_id = $3 where id = $4 returning *`,
            [
                fullname || sectionById.rows[0].fullname,
                shortname || sectionById.rows[0].shortname,
                part_id || sectionById.rows[0].org_id,
                id
            ]
        );
        res.status(200).json(updatedSection.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//delete section
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('delete from section where id= $1', [req.params.id])
        res.status(200).json('Deleted successfully')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})


module.exports = router