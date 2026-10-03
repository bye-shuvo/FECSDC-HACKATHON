const express = require('express');
const controller = require('../controller/controller');

const router = express.Router();

router.get('/', controller.home);
router.get('/health', controller.health);
router.post('/register', controller.register);
router.get('/questions', controller.getQuestions);
router.get('/question/:pk', controller.getQuestion);
router.post('/submit/:pk', controller.submitAnswer);

module.exports = router;
