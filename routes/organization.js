const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

// get all organizations
router.get('/', async (req, res) => {
    try {
        const organizations = await pool.query('select * from organization')
        res.status(200).json(organizations.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

//get organization by id
router.get('/:id', async(req, res)=>{
    try {
        const { id } = req.params
        const OrgById = await pool.query('SELECT * FROM organization WHERE id = $1', [id]);
        res.status(200).json(OrgById.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// add new organization
router.post('/', async (req, res) => {
    try {
        const { id, fullname, shortname, description } = req.body
        const newOrg = await pool.query(
            `insert into organization (id, fullname, shortname, description) values ($1, $2, $3, $4) returning *`,
            [id, fullname, shortname, description]
        );
        res.status(201).json('Created successfully');
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// update organization
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, shortname, description } = req.body
        const OrgById = await pool.query('SELECT * FROM organization WHERE id = $1', [id]);
        const updatedOrg = await pool.query(
            `update organization set fullname = $1, shortname = $2, description = $3 where id =$4 returning *`,
            [
                fullname || OrgById.rows[0].fullname,
                shortname || OrgById.rows[0].shortname,
                description || OrgById.rows[0].description,
                id
            ]
        );
        res.status(200).json(updatedOrg.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//delete organization
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('delete from organization where id= $1', [req.params.id])
        res.status(200).json('Deleted successfully')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})



module.exports = router