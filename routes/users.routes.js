'use strict'

const { 
	loginUser,
	registerUser
} = require('../controllers/user.controller');

module.exports = app => {
	app.post('/user/register', registerUser);
	app.post('/user/login', loginUser);
}

