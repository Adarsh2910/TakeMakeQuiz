'use strict'

const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const q = require('q');
const url = require('../config/config').dbCredentials();

const connectToDB = () => {
	let defer = q.defer();

	mongo.connect(url, (err, db) => {
		if(!err) {
			defer.resolve(db);
		}
		else {
	 		defer.reject(err);
		}
	});

	return defer.promise;
}

class Collection {

	constructor(collectionName) {
		this.collectionName = collectionName;
		connectToDB()
			.then(db => {
				// TODO Refactor this
				this.collection = db.collection(collectionName);
				this.collection.createIndex( { email : 1 }, { unique: true } );
			})
			.catch(err => {
				console.log('Error occurred while initializing collection.\n' + err);
			})
	}

	addDocument(data) {
		let defer = q.defer();

		this.collection.insertOne(data, (error,reponse) => {
			if(!error) {
				console.log("Document added in " + this.collectionName);
				defer.resolve({"success":true, "error": null});
			}
			else {
				console.log("Error occurred while adding document.\n" + error);
				defer.reject({"success": false, "error": error});
			}
		});

		return defer.promise;
	}

	findDocument(attributeName, filter, coords) {
		let defer = q.defer();

		try {
			this.collection.find({
				[attributeName] : filter,
			})
			.toArray((err, docs) => {
			    if(docs.length === 0) {
					defer.reject("Empty result set");
				} else {
					console.log("Found the following records");
				    console.log(docs);
				    defer.resolve(docs);
				}
			});
		}
		catch(error) {
			console.log(error);
			defer.reject(error);
		}

		return defer.promise;
	}

	updateDocument(filter, attributeName, newAttribute) {
		let defer = q.defer();


		this.collection.updateOne(
			{ 'email' : filter },
			{
				$set: { [attributeName] : newAttribute },
				$currentDate: { lastModified: true }
			},
			{ upsert : true },
			(error, response) => {
				if(!error) {
					console.log("Document updated in " + this.collectionName);
					defer.resolve({"success":true, "error": null});
				}
				else {
					console.log("Error occurred while updating document.\n" + error);
					defer.reject({"success": false, "error": error});
				}
			}
		)

		return defer.promise;
	}

}

module.exports = {
	Collection
}
