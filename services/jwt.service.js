'use strict'

const jwt = require('jsonwebtoken');
const privateKey = require('../config/config');
const q = require('q');

const getToken = (payload, expiryTime = 30 * 12 * 60 * 60 * 60) => {
	let defer = q.defer();

	jwt.sign(payload, privateKey.privateKey, { expiresIn: expiryTime }, (err, token) => {
		if(!err) {
			console.log('Token generated.');
			defer.resolve(token);
		} else {
			console.log(err);
			console.log('Error generating token.');
			defer.reject(err);
		}
	});

	return defer.promise;
}

const decodeToken = (token) => {
	let defer = q.defer();

	jwt.verify(token, privateKey.privateKey, (err, decoded) => {
		if(!err) {
			console.log('Token verified.');
			defer.resolve(decoded);
		} else {
			console.log('Error verifying token.');
			defer.reject(err);
		}
	});

	return defer.promise;
}

module.exports = {
	getToken,
	decodeToken
}
