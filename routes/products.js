const express = require('express');
const router = express.Router();

const {getALLStatic, getALL} = require('../controllers/products');

router.route('/').get(getALL);
router.route('/static').get(getALLStatic);

module.exports = router;