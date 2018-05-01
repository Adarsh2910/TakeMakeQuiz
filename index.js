'use strict'

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const db = require('./services/db.service');

db.connectToDB()
	.then(db => {
        let user = db.collection('user');
        let taken = db.collection('taken');
        let quiz = db.collection('quiz');
        let userQuiz = db.collection('userQuiz');
		user.createIndex( { email : 1 }, { unique: true } );
	})
	.catch(err => {
		console.log('Error occurred while initializing collection.\n' + err);
	})

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('static'));
app.use(express.static('res'));

app.get('/', function(req, res) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    if(req.cookies.token) {
        res.redirect('/takeMake');    
    }
    else {
        res.sendFile(path.join(__dirname + '/login.html'));
    }
});

app.get('/takeMake', function(req, res) {
    if(req.cookies.token) {
    res.sendFile(path.join(__dirname + '/takemake.html'));
    }
    else {
        res.redirect('/');    
    }
});

require('./routes/users.routes.js')(app);

app.listen(8095, err => {
    if (err) {
        console.log(err);
    } else {
        console.log("Server running on port 8095...");
    }
});