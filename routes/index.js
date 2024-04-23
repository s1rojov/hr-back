const { Router } = require("express");
const router = Router();

router.use('/organization', require('./organization'))
router.use('/part', require('./part'))


module.exports = router