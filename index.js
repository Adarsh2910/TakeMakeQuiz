'use strict'

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');

const query = require('./services/db.service');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./routes/users.routes.js')(app);

app.listen(8095, err => {
    if (err) {
        console.log(err);
    } else {
        console.log("Server running on port 8095...");
    }
});