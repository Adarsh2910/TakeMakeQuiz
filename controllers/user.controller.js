'use strict'

const jwt = require('../services/jwt.service');
const bcrypt = require('../services/bcrypt.service');
const db = require('../services/db.service');

const quiz = new db.Collection('quiz');

const q = require('q');

const _checkIfUserExists = (collection, attributeName, email) => {
	let defer = q.defer();
	collection.findDocument(attributeName, email)
		.then(res => {
			defer.resolve(true);
		})
		.catch(error => {
			defer.resolve(false);
		})

	return defer.promise;
}

const _writeToDB = (collection, data ) => {
	return collection.addDocument(data);
}

const _updateDB = (collection, filter, attributeName, data ) => {
	return collection.updateDocument(filter, attributeName, data)
}

const _generateToken = (payload, expiry) => {
	return jwt.getToken(payload, expiry);
}

const _hashText = (plainText) => {
	return bcrypt.hashText(plainText);
}

const getQuizzesTaken = (req, res) => {
	let response = {
		"success" : false,
		"quizzes" : undefined,
		"error" : undefined,
		"message" : undefined
	}

	quiz.findDocument('email', req.body.data.email)
		.then(results => {
			resposne = {
				...response,
				success : true,
				quizzes : results.quizzes,
				message : 'Fetched quizzes taken.'
			}

			res.status(200).json(response);
		})
		.catch(error => {
			resposne = {
				...response,
				error,
				message : 'Failed to fetch quizzes taken.'
			}

			res.status(200).json(response);
		})
}


const registerUser = (req, res) => {
	let response = {
		"success": false,
		"message": undefined,
	}

	let entryData = req.body;

	_checkIfUserExists(user, "email", entryData.email)
		.then(userExists => {
			if(!userExists) {
				_hashText(entryData.password)
					.then((hashedPassword) => {
						entryData = {
							...entryData,
							"password" : hashedPassword
						}
					})
					.then(() => {
						_writeToDB(user, entryData)
						return entryData;
					})
					.then(_generateToken)
					.then((token) => {
						response = {
							...response,
							"success": true,
							"message": "Registration successful.",
							"token": token
						}
						res.status(200).cookie(response);
					})
					.catch(error => {
						response = {
							...response,
							"message": error
						}
						res.status(405).json(response);
					});
			} else {
				response = {
					...response,
					"message": "Already registered."
				}
				res.status(200).json(response);
			}
		})
}

const loginUser = (req, res) => {

	let response = {
		"success": false,
		"message": undefined,
		"token": undefined
	}

	_findInDB(user, "email", req.body.email)
		.then((data) => {
			return _decodePass(`${req.body.password}`, data[0].password)
		})
		.then((data) => {
			return _generateToken({"pass":req.body.password})
		})
		.then(data => {
			response = {
				...response,
				"success": true,
				"message": "User authenticated",
				"token": data
			}
			res.status(200).cookie(response);
		})
		.catch(error => {
			response = {
				...response,
				"message": "User authentication failed"
			}
			res.status(403).json(response);
		})
}

module.exports = {
	loginUser,
	registerUser
}
