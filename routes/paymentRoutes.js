const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');


router.post('/init', paymentController.initTransaction);


router.post('/commit', paymentController.commitTransaction);

module.exports = router;