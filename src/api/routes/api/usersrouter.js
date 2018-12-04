const express = require('express');
let UsersRouter = express.Router();
const User = require('../../models/user.js');
const passportConfig = require('../../passport.js');
const mongoose = require('mongoose');

UsersRouter.get('/current', passportConfig.loggedInMiddleware, (req, res, next) => {
	res.redirect(303, `/api/users/${req.user._id}`);
});

UsersRouter.put('/current', passportConfig.loggedInMiddleware, (req, res, next) => {
	User.findOneAndUpdate({_id: req.user._id}, { $set: req.body}, {new: true}, function (err, user){
		res.redirect(307, `/api/users/${req.user._id}`);
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

UsersRouter.put('/:id', passportConfig.loggedInMiddleware, (req, res, next) => {
	if(!mongoose.Types.ObjectId(req.params.id).equals(req.user._id)){
		return res.status(403).json({error: 'Can only change your user'});
	}
	console.log(JSON.stringify(req.body));
	User.findOneAndUpdate({_id: req.params.id}, { $set: req.body}, {new: true}).exec(function (err, user){
			if(err){
				return res.status(500).send(err)
			}
			res.redirect(303, `/api/users/${req.user._id}`);
		}
	);
});

module.exports = UsersRouter;