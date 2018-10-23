const express = require('express');
let UsersRouter = express.Router();
const User = require('../../models/user.js');

UsersRouter.get('/current', (req, res, next) => {
	User.findOne({_id: req.user.id}).lean().exec(function (err, user){
		if(err){
			return res.status(500).send(err)
		}
			delete user.password_hash;
			return res.json(user);
		}
	);
});

UsersRouter.get('/:id', (req, res, next) => {
	User.findOne({_id: req.params.id}).lean().exec(function (err, user){
			if(err){
				return res.status(500).send(err)
			}
			delete user.password_hash;
			return res.json(user);
		}
	);
});

module.exports = UsersRouter;