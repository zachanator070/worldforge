const express = require('express');
let AuthRouter = express.Router();
const passport = require("passport");
const passportConfig = require('../../passport.js');

AuthRouter.post('/login', (req, res, next) => {
	passport.authenticate('local-login', {
		usernameField: 'email',
		passwordField: 'password'
	}, function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json(info);
		}
		req.login(user, (err) => {
			return res.status(200).send('OK');
		});
	})(req, res, next);

});

AuthRouter.post('/register', (req, res, next) => {
	passport.authenticate('local-signup', {
		usernameField: 'email',
		passwordField: 'password'
	}, function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json(info);
		}

		req.login(user, (err) => {
			return res.status(200).send('OK');
		});
	})(req, res, next);
});

AuthRouter.get('/logout', function(req, res) {
	req.logout();
	return res.send('OK');
});

AuthRouter.get('/session/check', passportConfig.loggedInMiddleware, function(req, res){
	return res.send('OK');
});

module.exports =  AuthRouter;