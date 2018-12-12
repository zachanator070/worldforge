const passportConfig = require("../../passport");
const mongoose = require('mongoose');
const express = require('express');
let WorldRouter = express.Router();
const World = require('../../models/world.js');
const WikiPage = require('../../models/wikipage');
const WikiFolder = require('../../models/wikifolder');

function getFolder(folderId) {
	return new Promise((resolve, reject) => {

		WikiFolder.findOne({_id: folderId}).populate({
			path: 'pages children'
		}).lean().exec((err, folder) => {
			const promises = [];
			if(err){
				reject(err);
			}
			const children = [];
			for(let childId of folder.children){
				promises.push(getFolder(childId));
			}
			Promise.all(promises).then((children) => {
				folder.children = children;
				resolve(folder);
			}).catch((err) => {
				reject(err);
			});
		});
	});

}

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
			return res.json(worlds.map((world) => {return world._id;}));
		}
	);
});

WorldRouter.get('/:id', (req, res, next) => {
	World.findOne({_id: req.params.id})
		.populate({
			path: 'wikiPage rootFolder',
			populate: {path: 'coverImage mapImage world pages'}
		}).populate({
			path: 'owner readUsers writeUsers',
			select: '-password_hash'
		})
		.exec((err, world) => {
			if(!(req.user !== undefined && world.userCanRead(req.user)) && !world.public){
				return res.status(403).json({error: 'You do not have permission to read'})
			}
			if(err){
				return res.status(500).json({error: err.message})
			}

			world = world.toObject();

			let canWrite = false;
			if(req.user){
				if(world.owner._id.equals(req.user._id) || world.writeUsers.filter((id) => {return id.equals(req.user._id);}).length > 0){
					canWrite = true;
				}
			}
			world.canWrite = canWrite;

				getFolder(world.rootFolder._id).then((folder) => {
					world.rootFolder = folder;
					return res.json(world);
				}).catch((err) => {
					return res.status(500).json({error: err.message})
				});
			}
		);
});

WorldRouter.post('/', passportConfig.loggedInMiddleware, (req, res, next) => {

	let isPublic = (req.body.public !== null ? req.body.public: false);
	World.create({name: req.body.name, owner: req.user._id, public: isPublic}, function(err, createdWorld){
		if(err){
			return res.status(500).json({error: err.message})
		}
		// create place wiki page
		WikiPage.create({name: req.body.name, world: createdWorld._id, type: 'place'}, (err, createdWiki) => {
			if(err){
				return res.status(500).json({error: err.message})
			}
			createdWorld.wikiPage = createdWiki._id;
			createdWorld.save((err) => {
				if(err){
					return res.status(500).json({error: err.message})
				}
				// create root wiki folder
				WikiFolder.create({name: 'root', world: createdWorld._id, pages: [createdWiki._id]}, (err, rootFolder) => {
					const folderPromises = [];
					const defaultFolders = ['People', 'Places', 'Items', 'Abilities', 'Spells'];
					for(let folderName of defaultFolders){
						folderPromises.push(new Promise((resolve, reject) => {
							WikiFolder.create({name: folderName, world: createdWorld._id}, (err, folder) => {
								if(err){
									reject(err);
								}
								resolve(folder);
							})
						}));
					}

					// create default folders
					Promise.all(folderPromises).then((folders) => {
						rootFolder.children = folders.map((folder) => {return folder._id});
						rootFolder.save((err) => {
							if(err){
								return res.status(500).json({error: err.message})
							}
							createdWorld.rootFolder = rootFolder._id;
							createdWorld.save((err) => {
								if(err){
									return res.status(500).json({error: err.message})
								}
								return res.redirect(303, `/api/worlds/${createdWorld._id}`);
							});
						});
					}).catch((err) => {
						if(err){
							return res.status(500).json({error: err.message})
						}
					});

				});
			});
		});
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

		World.findOneAndUpdate({_id: req.params.id}, { $set: req.body}, {new: true}, function (err, world){
			if(err){
				return res.status(500).json({error: err.message})
			}
			res.redirect(303, `/api/worlds/${req.params.id}`);
		});

	});

});

module.exports = WorldRouter;