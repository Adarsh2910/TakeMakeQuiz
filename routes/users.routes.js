'use strict'

const { 
	login,
	register,
	fetchTakenQuiz
} = require('../controllers/user.controller');

const {
	isAuthenticated
} = require('../middlewares/isAuthenticated');

module.exports = app => {
	app.post('/user/register', register);
	app.post('/user/login', login);
	app.get('/user/takenQuiz', isAuthenticated, fetchTakenQuiz);
}

