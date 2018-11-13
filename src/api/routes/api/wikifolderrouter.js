
const express = require('express');
let WikiFolderRouter = express.Router();
const WikiFolder = require('../../models/wikifolder');
const passportConfig = require('../../passport');
const World = require('../../models/world');

WikiFolderRouter.get('/:id', (req, res, next) => {

	// find parent and check for read access
	WikiFolder.findOne({_id: req.params.id})
		.populate({
			path: 'world pages',
			populate: {path: 'owner'}
		}).exec((err, folder) => {
			if (err) {
				return res.status(500).json({error: err})
			}
			return res.json(folder);
		}
	);
});

WikiFolderRouter.put('/:id', passportConfig.loggedInMiddleware, (req, res, next) => {

	WikiFolder.findOne({_id: req.params.id})
		.populate({
			path: 'world ',
			populate: {path: 'owner'}
		}).exec((err, folder) => {
		if(err){
			return res.status(500).json({error: err})
		}
		if(!folder.world.userCanWrite(req.user)){
			return res.status(403).json({error: 'Unauthorized'});
		}

		WikiFolder.findOneAndUpdate({_id: req.params.id}, { $set: req.body}).exec((err, folder) => {
			res.redirect(303, `/api/wikiFolders/${folder._id}`);
		});
	});

});

WikiFolderRouter.post('/', passportConfig.loggedInMiddleware, (req, res, next) => {

	World.findOne({_id: req.user.currentWorld}).exec(function (err, world) {
		if (err) {
			return res.status(500).json({error: err.message})
		}

		if(!world){
			return res.status(404).json({error: 'user has no world selected'})
		}

		if (!world.userCanWrite(req.user)) {
			return res.status(403).json({error: 'You do not have permission to edit'})
		}

		req.body.world = req.user.currentWorld;

		WikiFolder.create(req.body, function (err, createdWorld) {
			if (err) {
				return res.status(500).json(err)
			}
			return res.json(createdWorld);
		});
	});
});

WikiFolderRouter.delete('/:id', passportConfig.loggedInMiddleware, (req, res, next) => {

	WikiFolder.findOne({_id: req.params.id})
		.populate({
			path: 'world ',
			populate: {path: 'owner'}
		}).exec((err, folder) => {
		if(err){
			return res.status(500).json({error: err});
		}
		if(!folder.world.userCanWrite(req.user)){
			return res.status(403).json({error: 'Unauthorized'});
		}

		WikiFolder.deleteOne({_id: req.params.id}).exec((err) => {
			if(err){
				return res.status(500).json({error: err});
			}
			return res.status(200).send();
		});
	});
});

module.exports = WikiFolderRouter;