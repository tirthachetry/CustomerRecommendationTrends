const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/recom', controller.getRecommedations);
router.get('/similar', controller.getSimilar);

module.exports = router;