'use strict'

module.exports = {
	dbCredentials : (name = 'takemake', port = 27017, host = 'localhost') => `mongodb://${host}:${port}/${name}`,
	privateKey : () => 'anil'
}
