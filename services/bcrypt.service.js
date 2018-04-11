'use strict'

const bcrypt = require('bcrypt');
const q = require('q');
const Collection = require('./db.service');

const saltRounds = 8;

const hashText = (plainText) => {
	return bcrypt.hash(plainText, saltRounds);
}

const verifyText = (text, hash) => {
	let defer = q.defer();

	bcrypt.compare(text, hash)
		.then((isEqual) => {
			if(isEqual) {
				defer.resolve(true);		
			}
			else {
				defer.reject(false);		
			}
		})
		
	return defer.promise;
}

module.exports = {
	hashText,
	verifyText
}
