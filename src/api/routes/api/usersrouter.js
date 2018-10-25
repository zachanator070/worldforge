const express = require('express');
let UsersRouter = express.Router();
const User = require('../../models/user.js');
const passportConfig = require('../../passport.js');

UsersRouter.get('/current', passportConfig.loggedInMiddleware, (req, res, next) => {
	res.redirect(`/api/users/${req.user._id}`);
});

UsersRouter.put('/current', passportConfig.loggedInMiddleware, (req, res, next) => {
	User.findOneAndUpdate({_id: req.user._id}, { $set: req.body}, function (err, user){
		res.redirect(`/api/users/${req.user._id}`);
	});
});

UsersRouter.get('/:id', (req, res, next) => {
	User.findOne({_id: req.params.id}).exec(function (err, user){
			if(err){
				return res.status(500).send(err)
			}
			delete user.password_hash;
			delete user.email;
			return res.json(user);
		}
	);
});

module.exports = UsersRouter;