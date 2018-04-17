'use strict'

const jwt = require('../services/jwt.service');

const isAuthenticated = (req, res, next) => {
    let response = {
        success : false,
        message : undefined
    }

    const token = req.cookies.token;

    if(token) {
        jwt.decodeToken(token)
            .then(data => {
                req.body.data = data.email;
                next();
            })
            .catch(error => {
                response = {
                    ...response,
                    error,
                    message : 'Authorized.'
                }

                res.status(200).json(response);
            })
    } else {
        response = {
            ...response,
            message : 'Cookie undefined.'
        }

        res.status(403).json(response).redirect('/');
    }
}

module.exports = {
    isAuthenticated
}