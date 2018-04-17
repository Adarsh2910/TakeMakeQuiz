'use strict'

const jwt = require('../services/jwt.service');
const bcrypt = require('../services/bcrypt.service');
const db = require('../services/db.service');

const user = new db.Collection('user');
const takenQuiz = new db.Collection('taken');

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

const _fetchData = (collection, attributeName, filter) => {
	return collection.findDocument(attributeName, filter);
}

const _decodePass = (text, pass) => {
	return bcrypt.verifyText(text, pass);
}

const register = (req, res) => {
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
					.then((data) => {
						response = {
							...response,
							"success": true,
							"message": "Registration successful.",
						}
						res.cookie('token', data).status(200).send(response);
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

const login = (req, res) => {

	let response = {
		"success": false,
		"message": undefined,
	}

	_fetchData(user, "email", req.body.email)
		.then((data) => {
			return _decodePass(`${req.body.password}`, data[0].password)
		})
		.then((data) => {
			return _generateToken({"email":req.body.email})
		})
		.then(data => {
			response = {
				...response,
				"success": true,
				"message": "User authenticated",
			}
			res.cookie('token', data).status(200).json(response);
		})
		.catch(error => {
			response = {
				...response,
				"message": "User authentication failed"
			}
			res.status(403).json(response);
		})
}

const fetchTakenQuiz = (req, res) => {
	let response = {
		"success": false,
		"message": null
	}
	_fetchData(takenQuiz, "email", req.body.data)
		.then((data) => {
			response = {
				...response,
				"success": true,
				"message": "User data retrieved",
				...data
			}
			res.status(200).json(response);
		})
		.catch(error => {
			response = {
				...response,
				"message": "Error occured while fetching user data",
				error
			}
			res.status(500).json(response);
		});

}



module.exports = {
	login,
	register,
	fetchTakenQuiz
}