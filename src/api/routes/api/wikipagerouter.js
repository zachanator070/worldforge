
const express = require('express');
let WikiPageRouter = express.Router();
const WikiPage = require('../../models/wikipage');
const passportConfig = require('../../passport');
const World = require('../../models/world');

WikiPageRouter.get('/:id', (req, res, next) => {

	WikiPage.findOne({_id: req.params.id})
		.populate({
			path: 'world coverImage mapImage',
			populate: {
				path: 'owner icon chunks',
				populate: {path: 'chunks'}
			}
		}).exec((err, page) => {
			if(err){
				return res.status(500).json({error: err})
			}
			if(!page){
				return res.status(404).send();
			}
			if(!page.world.userCanRead(req.user)){
				return res.status(403).json({error: 'Unauthorized'});
			}
			return res.json(page);
	});

});

WikiPageRouter.get('/', (req, res, next) => {

	if(!req.query.world){
		return res.status(400).json({error: 'Need world id parameter'});
	}

	World.findOne({_id: req.query.world}, (err, world) => {
		if(err){
			return res.status(500).json({error: err})
		}

		if(!world.userCanRead(req.user)){
			return res.status(403).json({error: 'Unauthorized'});
		}

		const params = {
			world: req.query.world
		};
		if(req.query.name){
			params.name = { $regex: '^' + req.query.name + '.*' , $options: 'i'}
		}

		WikiPage.find(params, (err, pages) => {
			if(err){
				return res.status(500).json({error: err})
			}
			return res.json(pages);
		});
	});



});

WikiPageRouter.put('/:id', passportConfig.loggedInMiddleware, (req, res, next) => {

	WikiPage.findOne({_id: req.params.id})
		.populate({
			path: 'world coverImage mapImage',
			populate: {path: 'owner'}
		}).exec((err, page) => {
			if(err){
				return res.status(500).json({error: err})
			}
			if(!page.world.userCanWrite(req.user)){
				return res.status(403).json({error: 'Unauthorized'});
			}

			// TODO: need to figure out what to do when a new image is set on the page, need image cleanup logic

			WikiPage.findOneAndUpdate({_id: req.params.id}, { $set: req.body}).exec((err, page) => {
				if(err){
					return res.status(500).json({error: err})
				}
				return res.redirect(303, `/api/wikiPages/${page._id}`);
			});
		});

});

WikiPageRouter.post('/', passportConfig.loggedInMiddleware, (req, res, next) => {

	WikiPage.create(req.body, function(err, createdWorld){
		if(err){
			return res.status(500).json(err)
		}
		return res.json(createdWorld);
	});
});

module.exports = WikiPageRouter;