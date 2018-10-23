const passportConfig = require("../../passport");

const express = require('express');
let WorldRouter = express.Router();
const World = require('../../models/world.js');

WorldRouter.get('/', (req, res, next) => {
	let conditions = [{public: true}];
	if(req.user){
		conditions.push({read: req.user._id});
		conditions.push({owner: req.user._id});
	}
	World.find({ $or: conditions }, function (err, worlds){
			if(err){
				return res.status(500).json({error: err})
			}
			return res.json(worlds);
		}
	);
});

WorldRouter.post('/', passportConfig.loggedInMiddleware, (req, res, next) => {

	World.findOne({name: req.body.name, owner: req.user._id}, function(err, foundWorld){
		if(err){
			return res.status(500).json({error: err})
		}
		if(foundWorld !== null){
			return res.status(400).json({error: `World already exists with name ${req.body.name}`});
		}
		World.create({name: req.body.name, owner: req.user._id}, function(err, createdWorld){
			if(err){
				return res.status(500).json({error: err})
			}
			return res.json(createdWorld);
		});
	});
});

module.exports = WorldRouter;