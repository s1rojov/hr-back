const { Router } = require("express");
const router = Router();

router.use('/leadership', require('./leadership'))
router.use('/division', require('./division'))
router.use('/admin', require('./admin'))
router.use('/auth', require('./auth'))

module.exports = router