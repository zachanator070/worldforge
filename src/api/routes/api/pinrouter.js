
const express = require('express');
let PinRouter = express.Router();
const Pin = require('../../models/pin');
const passportConfig = require('../../passport');
const World = require('../../models/world');

PinRouter.get('/:id', (req, res, next) => {

	Pin.findOne({_id: req.params.id})
		.populate({
			path: 'world page',
			populate: {
				path: 'owner',
			}
		}).exec((err, pin) => {
		if(err){
			return res.status(500).json({error: err})
		}
		if(!pin){
			return res.status(404).send();
		}
		if(!pin.world.userCanRead(req.user)){
			return res.status(403).json({error: 'Unauthorized'});
		}
		return res.json(pin);
	});

});

PinRouter.get('/', (req, res, next) => {

	if(!req.query.world){
		return res.status(400).json({error: 'Need world id parameter'});
	}

	World.findOne({_id: req.query.world}).populate('owner').exec((err, world) => {
		if(err){
			return res.status(500).json({error: err})
		}

		if(!world.userCanRead(req.user)){
			return res.status(403).json({error: 'Unauthorized'});
		}

		const params = {
			world: req.query.world
		};

		if(req.query.map){
			params.map = req.query.map;
		}

		Pin.find(params).populate('world page').exec((err, pins) => {
			if(err){
				return res.status(500).json({error: err})
			}
			return res.json(pins);
		});
	});



});

PinRouter.put('/:id', passportConfig.loggedInMiddleware, (req, res, next) => {

	Pin.findOne({_id: req.params.id})
		.populate('world').exec((err, pin) => {
		if(err){
			return res.status(500).json({error: err})
		}
		if(!pin.world.userCanWrite(req.user)){
			return res.status(403).json({error: 'Unauthorized'});
		}

		Pin.findOneAndUpdate({_id: req.params.id}, { $set: req.body}).exec((err, pin) => {
			if(err){
				return res.status(500).json({error: err})
			}
			return res.redirect(303, `/api/pins/${pin._id}`);
		});
	});

});

PinRouter.delete('/:id', passportConfig.loggedInMiddleware, (req, res, next) => {

	Pin.findOne({_id: req.params.id})
		.populate('world').exec((err, pin) => {
		if(err){
			return res.status(500).json({error: err})
		}
		if(!pin.world.userCanWrite(req.user)){
			return res.status(403).json({error: 'Unauthorized'});
		}

		Pin.findOneAndDelete({_id: req.params.id}).exec((err, pin) => {
			if(err){
				return res.status(500).json({error: err})
			}
			return res.status(200).send();
		});
	});

});

PinRouter.post('/', passportConfig.loggedInMiddleware, (req, res, next) => {

	Pin.create(req.body, function(err, createdPin){
		if(err){
			return res.status(500).json(err)
		}
		return res.redirect(303, `/api/pins/${createdPin._id}`);
	});
});

module.exports = PinRouter;