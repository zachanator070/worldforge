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
	World.find({ $or: conditions })
		.populate({
			path: 'owner wikiPage',
			populate: {path: 'coverImage mapImage world'}
		})
		.exec((err, worlds) => {
			if(err){
				return res.status(500).json({error: err})
			}
			return res.json(worlds);
		}
	);
});

WorldRouter.get('/:id', (req, res, next) => {
	let conditions = [{public: true}, {_id: req.params.id}];
	if(req.user){
		conditions.push({read: req.user._id});
		conditions.push({owner: req.user._id});
	}
	World.findOne({ $or: conditions })
		.populate({
			path: 'owner wikiPage',
			populate: {path: 'coverImage mapImage world'}
		})
		.exec((err, world) => {
				if(err){
					return res.status(500).json({error: err})
				}
				return res.json(world);
			}
		);
});

WorldRouter.post('/', passportConfig.loggedInMiddleware, (req, res, next) => {

	let isPublic = (req.body.public !== null ? req.body.public: false);
	World.create({name: req.body.name, owner: req.user._id, public: isPublic}, function(err, createdWorld){
		if(err){
			return res.status(500).json(err)
		}
		return res.json(createdWorld);
	});
});

WorldRouter.put('/:id', passportConfig.loggedInMiddleware, (req, res, next) => {
	World.findOne({_id: req.params.id}).exec(function (err, world){
		if(err){
			return res.status(500).json(err)
		}
		let canEdit = req.user._id === world.owner;
		if(world.writeUsers.includes(req.user._id)){
			canEdit = true;
		}
		if(canEdit){
			World.findOneAndUpdate({_id: req.params.id}, { $set: req.body}, function (err, world){
				res.redirect(`/api/worlds/${req.params._id}`);
			});
		}
		else {
			return res.status(403).json({error: 'You do not have permission to edit'})
		}
	});

});

module.exports = WorldRouter;