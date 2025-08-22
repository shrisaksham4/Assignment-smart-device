const express = require('express');
const router = express.Router();
const { registerUser, authUser } = require('../controllers/userControllers')


router.post('/signup', registerUser);
router.post('/login', authUser);


module.exports = router;