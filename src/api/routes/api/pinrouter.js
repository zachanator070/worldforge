
const express = require('express');
let PinRouter = express.Router();
const Pin = require('../../models/pin');
const passportConfig = require('../../passport');
const World = require('../../models/world');
const Image = require('../../models/image');

PinRouter.get('/:id', (req, res, next) => {

	let params = {};

	if(req.params.id){
		params._id = req.params.id;
	}

	params = Object.assign(params, req.query);

	Pin.findOne(params)
		.populate({
			path: 'map page',
			populate: {
				path: 'world',
				populate: {
					path: 'owner'
				}
			}
		}).exec((err, pin) => {
		if(err){
			return res.status(500).json({error: err})
		}
		if(!pin){
			return res.status(404).send();
		}
		if(!pin.map.world.userCanRead(req.user)){
			return res.status(403).json({error: 'Unauthorized'});
		}
		return res.json(pin);
	});

});

PinRouter.get('/', (req, res, next) => {

	const params = Object.assign({}, req.query);
	if(params.world){
		Image.find({world: params.world}, (err, images) => {
			if(err){
				return res.status(500).json({error: err})
			}

			if(images.length > 0){
				delete params.world;
				params.map = {$in: images.map((image) => {return image._id})};
			}

			Pin.find(params)
				.populate({
					path: 'map',
					populate: {
						path: 'world'
					}
				})
				.populate({
					path: 'page',
					populate: {
						path: 'mapImage world coverImage'
					}
				})
				.exec((err, pins) => {
					if(err){
						return res.status(500).json({error: err})
					}
					for(let pin of pins){
						if(!pin.map.world.userCanRead(req.user)){
							return res.status(401).json({error: 'You do not have permission to view this pin'});
						}
					}
					return res.json(pins);
				});

		})
	}


});

PinRouter.put('/:id', passportConfig.loggedInMiddleware, (req, res, next) => {

	Pin.findOne({_id: req.params.id})
		.populate({
			path: 'map page',
			populate: {
				path: 'world',
				populate: {
					path: 'owner'
				}
			}
		}).exec((err, pin) => {
		if(err){
			return res.status(500).json({error: err})
		}
		if(!pin.map.world.userCanWrite(req.user)){
			return res.status(403).json({error: 'Unauthorized'});
		}

		Pin.findOneAndUpdate({_id: req.params.id}, { $set: req.body}, {new: true}).exec((err, pin) => {
			if(err){
				return res.status(500).json({error: err})
			}
			return res.redirect(303, `/api/pins/${pin._id}`);
		});
	});

});

PinRouter.delete('/:id', passportConfig.loggedInMiddleware, (req, res, next) => {

	Pin.findOne({_id: req.params.id})
		.populate({
			path: 'map page',
			populate: {
				path: 'world',
				populate: {
					path: 'owner'
				}
			}
		}).exec((err, pin) => {
		if(err){
			return res.status(500).json({error: err})
		}
		if(!pin.map.world.userCanWrite(req.user)){
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