const { Router } = require("express");
const router = Router();

router.use('/organization', require('./organization'))
router.use('/part', require('./part'))
router.use('/section', require('./section'))
router.use('/employeeType', require('./employeeType'))
router.use('/employee', require('./employee'))
router.use('/admin', require('./admin'))
router.use('/auth', require('./auth'))

module.exports = router