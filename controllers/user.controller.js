'use strict'

const jwt = require('../services/jwt.service');
const bcrypt = require('../services/bcrypt.service');
const db = require('../services/db.service');

const user = new db.Collection('user');

const q = require('q');

const _checkIfUserExists = (collection,email) => {
	let defer = q.defer();

	collection.findDocument(email)
		.then(res => {
			if(res.length === 0) {
				defer.resolve(false);
			}
			else {
				defer.resolve(true);
			}
		});

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

}

module.exports = {
	loginUser,
	registerUser
}