'use strict'

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const db = require('./services/db.service');
const { isAuthenticated } = require('middlewares/isAuthenticated');

db.connectToDB()
	.then(db => {
        let user = db.collection('user');
        let taken = db.collection('taken');
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

app.get('/', isAuthenticated, function(req, res) {
    if(req.body.data) {
        res.redirect('/takeMake');    
    }
    else {
        res.sendFile(path.join(__dirname + '/index.html'));
    }
});

app.get('/takeMake', isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname + '/takemake.html'));
});

require('./routes/users.routes.js')(app);

app.listen(8095, err => {
    if (err) {
        console.log(err);
    } else {
        console.log("Server running on port 8095...");
    }
});