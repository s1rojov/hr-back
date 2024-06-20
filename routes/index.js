const { Router } = require("express");
const router = Router();

router.use('/leadership', require('./leadership'))
router.use('/division', require('./division'))
router.use('/department', require('./department'))
router.use('/department_head', require('./departmentHead'))
router.use('/kafedra', require('./kafedra'))
router.use('/kafedra', require('./kafedra'))
router.use('/application', require('./application'))
router.use('/admin', require('./admin'))
router.use('/employeeType', require('./employeeType'))
router.use('/employee', require('./employee'))
router.use('/auth', require('./auth'))

module.exports = router