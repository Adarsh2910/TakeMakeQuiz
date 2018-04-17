'use strict'

const { 
	login,
	register,
	fetchTakenQuiz,
	addQuiz,
	takeQuiz
} = require('../controllers/user.controller');

const {
	isAuthenticated
} = require('../middlewares/isAuthenticated');

module.exports = app => {
	app.post('/user/register', register);
	app.post('/user/login', login);
	app.get('/user/quiz/taken', isAuthenticated, fetchTakenQuiz);
	app.post('/user/quiz/add', isAuthenticated, addQuiz);
	app.post('/user/quiz/take', isAuthenticated, takeQuiz)
}

