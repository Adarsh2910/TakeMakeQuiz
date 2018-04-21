'use strict'

const jwt = require('../services/jwt.service');
const bcrypt = require('../services/bcrypt.service');
const db = require('../services/db.service');
var uniqid = require('uniqid');
const user = new db.Collection('user');
const takenQuiz = new db.Collection('taken');
const quiz = new db.Collection('quiz');
const userQuiz = new db.Collection('userQuiz')

const q = require('q');

const _checkIfUserExists = (collection, attributeName, email) => {
	let defer = q.defer();	

	collection.findDocument(attributeName, email)
		.then(res => {
			defer.resolve(true);
		})
		.catch(error => {
			defer.resolve(false);
		});

	return defer.promise;
};

const _writeToDB = (collection, data ) => {
	return collection.addDocument(data);
};

const _updateDB = (collection, filter, attributeName, data, isToBePushedInArray ) => {
	return collection.updateDocument(filter, attributeName, data, isToBePushedInArray)
};

const _generateToken = (payload, expiry) => {
	return jwt.getToken(payload, expiry);
};

const _hashText = (plainText) => {
	return bcrypt.hashText(plainText);
};

const _fetchData = (collection, attributeName, filter, offset) => {
	let defer = q.defer();

	collection.findDocument(attributeName, filter, offset)
		.then((data) => {
			defer.resolve(data);
		})
		.catch((error) => {
			defer.resolve(false);
		});

	return defer.promise;
};

const _decodePass = (text, pass) => {
	return bcrypt.verifyText(text, pass);
};

const _findInDbArray = (quiz,filter) => {
	let defer = q.defer();
	
	var index = quiz.find(function(quizObj, i){
	  if(quizObj.quizID === filter){
	    defer.resolve(true)
	  }
	  else {
	  	defer.resolve(false);
	  }
	});

	return defer.promise;
};

const register = (req, res) => {
	let response = {
		"success": false,
		"message": undefined,
	};

	let entryData = req.body;

	_checkIfUserExists(user, "email", entryData.email)
		.then(userExists => {
			if(!userExists) {
				_hashText(entryData.password)
					.then((hashedPassword) => {
						entryData = {
							...entryData,
							"password" : hashedPassword  
						};
					})
					.then(() => {
						_writeToDB(user, entryData);
						return entryData;
					})
					.then(_generateToken)
					.then((data) => {
						response = {
							...response,
							"success": true,
							"message": "Registration successful.",
							"redirect": "/takeMake"
						};
						res.cookie('token', data).status(200).send(response);
					})
					.catch(error => {
						response = {
							...response,
							"message": error
						};
						res.status(405).json(response);
					});
			} else {
				response = {
					...response,
					"message": "Already registered."
				};
				res.status(200).json(response);
			};
		});
};

const login = (req, res) => {

	let response = {
		"success": false,
		"message": undefined,
	};

	_fetchData(user, "email", req.body.email)
		.then(data => {
			console.log(req.body.password);
			console.log(data);
			return _decodePass(`${req.body.password}`, data[0].password);
		})
		.then((data) => {
			return _generateToken({"email":req.body.email});
		})
		.then(data => {
			response = {
				...response,
				"success": true,
				"message": "User authenticated",
				"redirect": '/takeMake'
			};
			res.cookie('token', data).status(200).json(response);
		})
		.catch(error => {
			response = {
				...response,
				"message": "User authentication failed"
			};
			res.status(403).json(response);
		});
};

const fetchTakenQuiz = (req, res) => {
	
	let response = {
		"success": false,
		"message": null
	};

	_fetchData(takenQuiz, "email", req.body.data)
		.then((resp) => {
			response = {
					...response,
					"success": true,
					"message": "Empty Set",
				};
			if(resp) {
				response = {
					...response,
					"message": "User data retrieved",
					"quizes": resp[0].quizes
				};	
			}
			else {
				response = {
					...response,
					"success": false,
					"message": resp
				};		
			}			
			res.status(200).json(response);
		})
		.catch(error => {
			response = {
				...response,
				"message": "Error occured while fetching user data",
				error
			};
			res.status(500).json(response);
		});

};

const addQuiz = (req, res) => {
	
	let response = {
		"success": false,
		"message": null
	};

	let quizId = uniqid(req.body.quizName);

	let dataForQuizCollection = {
		"quizId" : quizId,
		"quizname" : req.body.quizName,
		"questions" : req.body.questions,
		"quizTime" : req.body.quizTime
	};

	let dataForUserQuizCollection = {
		"quizId" : quizId,
		"quizName" : req.body.quizName,
		"quizMaker" : req.body.data,
		"people" : []
	};

	_writeToDB(quiz, dataForQuizCollection)
			return _updateDB(userQuiz, req.body.data, "quizes", dataForUserQuizCollection , true)
		.then(() => {
			response = {
				...response,
				"success": true,
				"message": "Quiz Added",
			};
			res.status(200).json(response);
		})
		.catch(() => {
			response = {
				...response,
				"success": false,
				"message": "Error while updating user's quiz",
			};
			res.status(500).json(response);
		});
};

const fetchCreatedByUser = (req, res) => {

	let response = {
		"success": false,
		"message": null
	};
	
	_fetchData(userQuiz, "email", req.body.data)
		.then((resp) => {
			response = {
					...response,
					"success": true,
					"message": "Empty Set",
				};
			if(resp) {
				response = {
					...response,
					"message": "User data retrieved",
					"quizes": resp[0].quizes
				};	
			}
			else {
				response = {
					...response,
					"success": false,
					"message": resp
				};		
			}			
			res.status(200).json(response);
		})
		.catch(error => {
			response = {
				...response,
				"message": "Error occured while fetching user data",
				error
			};
			res.status(500).json(response);
		});
};

const takeQuiz = (req, res) => {

	let response = {
		"success": false,
		"message": null
	}


	_fetchData(quiz, "quizId", `${req.body.quizID}`);
		.then(data => {
			response = {
				...response,
				"success": true,
				"message": "Questions retrieved",
				data
			}
			res.status(200).json(response);
		})
		.catch(error => {
			response = {
				...response,
				"message": "Error occured while fetching quizes",
				error
			};
			res.status(500).json(response);
		});		
};


const fetchAllQuiz = (req, res) => {
	
	let response = {
		"success" : false,
		"message" : null
	}
	_fetchData(quiz, undefined, undefined, parseInt(req.query.offset))
		.then(data => {
			response = {
				...response,
				"success": true,
				"message": "Fetched Quizes",
				data
			}
			res.status(200).json(response);
		})
		.catch(error => {
			response = {
				...response,
				"message": "Error occured while fetching quizes",
				error
			};

			res.status(500).json(response);
		});
}

const finishQuiz = (req, res) => {

	let response = {
		"success": false,
		"message": null
	}

	_fetchData(takenQuiz, "email", req.body.data)
		.then(resp => {
			if(resp) {
				let dataForTakenCollection = {
					"quizID" : req.body.quizID,
					"quizName" : req.body.quizName,
					"score" : req.body.score,
					"quizMaker" : req.body.quizMaker
				}

				_findInDbArray(resp[0].quizes, req.body.quizID)
					.then(resp => {
						if(!resp) {
							return _updateDB(takenQuiz, req.body.data, 'quizes', dataForTakenCollection, true)	
						}
					})
					.catch(error => {
						console.log(error);
					})
			}
			else {
				let data = {
					"email": req.body.data,
					"quizes": [{
						"quizID" : req.body.quizID,
						"quizName" : req.body.quizName,
						"score" : req.body.score,
						"quizMaker" : req.body.quizMaker
					}]
				}
				return _writeToDB(takenQuiz, data)
			}	
		})
		.then(() => {
			//add quiz takers email id to quiz creators collection
			return 
		})
		.then(() => {
			response = {
				...response,
				"success": true,
				"message": "Score Updated"
			}
			res.status(200).json(response);
		})
		.catch(error => {
			response = {
				...response,
				"message": "Score update failed"
			}
			res.status(403).json(response);
		})
}

module.exports = {
	login,
	register,
	fetchTakenQuiz,
	addQuiz,
	takeQuiz,
	fetchAllQuiz,
	fetchCreatedByUser,
	finishQuiz
}