'use strict'

const { 
	login,
	register,
	fetchTakenQuiz,
	addQuiz,
	takeQuiz,
	fetchAllQuiz,
	fetchCreatedByUser,
	finishQuiz
} = require('../controllers/user.controller');

const {
	isAuthenticated
} = require('../middlewares/isAuthenticated');

module.exports = app => {
	app.post('/user/register', register);
	app.post('/user/login', login);
	app.get('/user/quiz/taken/fetch', isAuthenticated, fetchTakenQuiz);
	app.post('/user/quiz/add', isAuthenticated, addQuiz);
	app.post('/user/quiz/take', isAuthenticated, takeQuiz);
	app.get('/user/quiz/fetch', isAuthenticated, fetchAllQuiz);
	app.get('/user/quiz/created/fetch', isAuthenticated, fetchCreatedByUser);
	app.post('/user/quiz/finish', isAuthenticated, finishQuiz);
}

