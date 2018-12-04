
const express = require('express');
let ImageRouter = express.Router();
const Image = require('../../models/image');
const Jimp = require('jimp');
const fs = require('fs');
const { Readable } = require('stream');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const passportConfig = require('../../passport');
const Chunk = require('../../models/chunk');
const chunkSize = 250;

ImageRouter.post('/', passportConfig.loggedInMiddleware, (req, res, next) => {

	const gfs = Grid(mongoose.connection.db, mongoose.mongo);
	const newImageSchema = {
		name: req.files.data.name,
		chunkList: [],
		world: req.user.currentWorld,
		chunkHeight: 0,
		chunkWidth: 0
	};

	let chunkImage = true;
	if('chunkImage' in req.body){
		chunkImage = req.body.chunkImage === 'true';
	}

	Jimp.read(req.files.data.data)
		.then(image => {
			newImageSchema.width = image.bitmap.width;
			newImageSchema.height = image.bitmap.height;
			let x = 0;
			let y = 0;
			let chunkJobs = [];
			if(!chunkImage){
				chunkJobs.push({
					image: image,
					width: image.bitmap.width,
					height: image.bitmap.height,
					x: 0,
					y: 0
				});
				newImageSchema.chunkHeight = 1;
				newImageSchema.chunkWidth = 1;
			}
			else {
				while(image.bitmap.width - x * chunkSize > 0){
					while( image.bitmap.height - y * chunkSize > 0){

						let width = chunkSize;
						let height = chunkSize;
						if(x * chunkSize + width > image.bitmap.width){
							width = image.bitmap.width - x * chunkSize;
						}
						if(y * chunkSize + height > image.bitmap.height){
							height = image.bitmap.height - y * chunkSize;
						}

						chunkJobs.push({
							image: image,
							width: width,
							height: height,
							x: x,
							y: y
						});

						y++;
						if(y > newImageSchema.chunkHeight){
							newImageSchema.chunkHeight++;
						}
					}
					y=0;
					x++;
					newImageSchema.chunkWidth = x;
				}
			}


			const chunkPromises = [];

			for(let job of chunkJobs){
				chunkPromises.push(new Promise((resolve, reject) => {

					Jimp.read(job.image).then((copy) => {
						copy.crop( job.x * chunkSize, job.y * chunkSize, job.width, job.height);
						// image.bitmap.width, image.bitmap.height, image.bitmap.data, req.files.data.name;
						const newFilename = `chunk.${job.x}.${job.y}.${req.files.data.name}`;
						const writeStream = gfs.createWriteStream({
							filename: newFilename,
							content_type: req.files.data.mimetype
						});

						writeStream.on('close', (file) => {
							const chunkSchema = {
								x: job.x,
								y: job.y,
								width: job.width,
								height: job.height,
								fileId: file._id
							};
							resolve(chunkSchema);
						});
						writeStream.on('error', function (err) {
							reject(err);
						});
						copy.getBuffer(req.files.data.mimetype, (err, buffer) => {
							writeStream.end(buffer);
						});
					});

				}));
			}

			Promise.all(chunkPromises).then((chunks) => {
				newImageSchema.chunks = chunks.map((chunk) => { return chunk._id; });
				Image.create(newImageSchema, (err, newImage) => {
					const createChunkPromises = [];
					for (let chunk of chunks){
						chunk.image = newImage._id;
						createChunkPromises.push(Chunk.create(chunk));
					}
					Promise.all(createChunkPromises).then((chunks) => {
						newImage.chunks = chunks.map((chunk) => { return chunk._id; });
						newImage.save(err => {
							if(err){
								return res.status(500).json({error: err.message});
							}
							makeIcon(req, newImage._id).then((icon) => {
								return res.redirect(303, `/api/images/${newImage._id}`);
							}).catch((error) => {
								return res.status(500).json({error: error.message});
							});
						});
					}).catch((err) => {
						return res.status(500).json({error: err.message});
					})

				});
			}).catch( err => {
				return res.status(500).json({error: err.message})
			});
		})
		.catch(err => {
			return res.status(500).json({error: err.message})
		});

});

ImageRouter.get('/:id', (req, res, next) => {
	Image.findOne({_id: req.params.id}).populate({
		path: 'world owner wikiPage chunks',
		populate: {path: 'coverImage mapImage world'}
	}).exec((err, image) => {

		if(!image){
			return res.status(404).send();
		}

		if((req.user && !image.world.userCanRead(req.user)) && !image.world.public){
			return res.status(403).json({error: 'You do not have permission to read'});
		}

		res.json(image);
	});
});

function makeIcon(req, newImageId) {
	return new Promise((resolve, reject) => {
		Image.findOne({_id: newImageId}, (err, foundImage) => {
			if(err){
				return reject(err);
			}
			if(!foundImage){
				return reject(new Error('Root image not found'));
			}
			const gfs = Grid(mongoose.connection.db, mongoose.mongo);

			Jimp.read(req.files.data.data)
				.then(image => {

					image.scaleToFit(chunkSize, chunkSize, (err, scaledImage) => {
						const newFilename = `chunk.0.0.${req.files.data.name}`;
						const writeStream = gfs.createWriteStream({
							filename: newFilename,
							content_type: req.files.data.mimetype
						});

						const newImageSchema = {
							name: 'icon.' + req.files.data.name,
							chunkList: [],
							world: req.user.currentWorld,
							chunkHeight: 1,
							chunkWidth: 1,
							width: scaledImage.bitmap.width,
							height: scaledImage.bitmap.height
						};

						writeStream.on('close', (file) => {
							Image.create(newImageSchema, (err, newImage) => {
								if (err) {
									return reject(err);
								}
								Chunk.create({
									x: 0,
									y: 0,
									width: scaledImage.bitmap.width,
									height: scaledImage.bitmap.height,
									fileId: file._id,
									image: newImage._id
								}, (err, chunk) => {
									if (err) {
										return reject(err);
									}
									newImage.chunks = [chunk._id];
									newImage.save((err) => {
										if (err) {
											return reject(err);
										}
										foundImage.icon = newImage._id;
										foundImage.save((err) => {
											if (err) {
												return reject(err);
											}
											resolve(newImage);
										});
									});
								});
							});
						});
						writeStream.on('error', function (err) {
							return reject(err);
						});
						scaledImage.getBuffer(Jimp.AUTO, (err, buffer) => {
							writeStream.end(buffer);
						});
					});
				}).catch(err => {
					return reject(err);
				});
		});
	});

}

module.exports = ImageRouter;