const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { requestMoney } = require('../controllers/request_money.controller');

router.use(verifyToken);

// POST /api/request-money
router.post('/', requestMoney);

module.exports = router;