const { Router } = require("express");
const router = Router();

router.use('/organization', require('./organization'))


module.exports = router