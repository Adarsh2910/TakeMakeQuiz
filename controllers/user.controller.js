'use strict'

const jwt = require('../services/jwt.service');
const bcrypt = require('../services/bcrypt.service');
const db = require('../services/db.service');

const user = new db.Collection('user');

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

const loginUser = (req, res) => {

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
						res.status(200).json(response);
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

const signinUser = (req, res) => {
	let response = {
		"success": false,
		"message": undefined,
	}
}

module.exports = {
	loginUser,
	registerUser
}