'use strict'

module.exports = {
	dbCredentials : (name = 'quiz', port = 27017, host = 'localhost') => `mongodb://${host}:${port}/${name}`,
	privateKey : () => 'anil'
}