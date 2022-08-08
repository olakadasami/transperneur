const express = require('express');
const {register_get, register_post, login_get, login_post, logout_get} = require('../controllers/userController')

const router = express.Router();



router.get('/register', register_get)
router.post('/register', register_post)

router.get('/login', login_get)
router.post('/login', login_post)

router.get('/logout', logout_get);

module.exports = router;