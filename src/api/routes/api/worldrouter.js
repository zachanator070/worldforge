const passportConfig = require("../../passport");
const mongoose = require('mongoose');
const express = require('express');
let WorldRouter = express.Router();
const World = require('../../models/world.js');

WorldRouter.get('/', (req, res, next) => {
	let conditions = [{public: true}];
	if(req.user){
		conditions.push({read: req.user._id});
		conditions.push({owner: req.user._id});
	}
	World.find({ $or: conditions })
		.populate({
			path: 'owner wikiPage',
			populate: {path: 'coverImage mapImage world'}
		})
		.exec((err, worlds) => {
			if(err){
				return res.status(500).json({error: err.message})
			}
			return res.json(worlds);
		}
	);
});

WorldRouter.get('/:id', (req, res, next) => {
	World.findOne({_id: req.params.id})
		.populate({
			path: 'owner wikiPage',
			populate: {path: 'coverImage mapImage world'}
		})
		.exec((err, world) => {
				if(!(req.user !== undefined && world.userCanRead(req.user)) && !world.public){
					return res.status(403).json({error: 'You do not have permission to read'})
				}
				if(err){
					return res.status(500).json({error: err.message})
				}
				return res.json(world);
			}
		);
});

WorldRouter.post('/', passportConfig.loggedInMiddleware, (req, res, next) => {

	let isPublic = (req.body.public !== null ? req.body.public: false);
	World.create({name: req.body.name, owner: req.user._id, public: isPublic}, function(err, createdWorld){
		if(err){
			return res.status(500).json({error: err.message})
		}
		res.redirect(303, `/api/worlds/${createdWorld._id}`);
	});
});

WorldRouter.put('/:id', passportConfig.loggedInMiddleware, (req, res, next) => {
	World.findOne({_id: req.params.id}).exec(function (err, world){
		if(err){
			return res.status(500).json({error: err.message})
		}

		if(!world.userCanWrite(req.user)){
			return res.status(403).json({error: 'You do not have permission to edit'})
		}

		World.findOneAndUpdate({_id: req.params.id}, { $set: req.body}, function (err, world){
			if(err){
				return res.status(500).json({error: err.message})
			}
			res.redirect(303, `/api/worlds/${req.params.id}`);
		});

	});

});

module.exports = WorldRouter;