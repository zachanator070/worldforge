
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

	let chunkify = true;
	if('chunkImage' in req.body){
		chunkify = req.body.chunkImage === 'true';
	}
	console.time('jimp read image');
	Jimp.read(req.files.data.data)
		.then(image => {

			Image.create({
				name: req.files.data.name,
				chunkList: [],
				world: req.user.currentWorld,
				width: image.bitmap.width,
				height: image.bitmap.height
			}, (err, newImage) => {
				console.timeEnd('jimp read image');
				if(err){
					return res.status(500).json({error: err.message})
				}

				try {
					if(!chunkify){
						createChunk(0, 0, image.bitmap.height, image.bitmap.width, image, newImage);
						newImage.chunkHeight = 1;
						newImage.chunkWidth = 1;
					}
					else {
						createChunkRecurse(0, 0, image, newImage);
						newImage.chunkHeight = Math.ceil(image.bitmap.height/chunkSize);
						newImage.chunkWidth = Math.ceil(image.bitmap.width/chunkSize);
					}
					newImage.save((err) => {
						if(err){
							return res.status(500).json({error: err.message});
						}
						makeIcon(req, newImage._id).then((icon) => {
							return res.redirect(303, `/api/images/${newImage._id}`);
						}).catch((error) => {
							return res.status(500).json({error: error.message});
						});
					});
				} catch (err) {
					return res.status(500).json({error: err.message});
				}
			});
		})
		.catch(err => {
			return res.status(500).json({error: err.message})
		});

});

function createChunkRecurse(x, y, image, parentImage){
	const xOk = image.bitmap.width - x * chunkSize > 0;
	const yOk = image.bitmap.height - y * chunkSize > 0;
	let width = chunkSize;
	let height = chunkSize;
	if(x * chunkSize + width > image.bitmap.width){
		width = image.bitmap.width - x * chunkSize;
	}
	if(y * chunkSize + height > image.bitmap.height){
		height = image.bitmap.height - y * chunkSize;
	}
	if(!yOk){
		return;
	}
	if(xOk) {
		createChunk(x, y, height, width, image, parentImage).then(() => {
			createChunkRecurse(x + 1, y , image, parentImage);
		});
	} else if(yOk) {
		createChunkRecurse(0, y + 1 , image, parentImage);
	}
}

function createChunk(x, y, height, width, image, parentImage){
	return new Promise((resolve, reject) => {
		const gfs = Grid(mongoose.connection.db, mongoose.mongo);

		console.time(`createChunk.${parentImage._id}.${x}.${y}`);
		Jimp.read(image).then((copy) => {
			copy.crop( x * chunkSize, y * chunkSize, width, height);
			const newFilename = `chunk.${x}.${y}.${parentImage.name}`;
			const writeStream = gfs.createWriteStream({
				filename: newFilename,
				content_type: image.getMIME()
			});

			writeStream.on('close', (file) => {

				Chunk.create({
					x: x,
					y: y,
					width: width,
					height: height,
					fileId: file._id,
					image: parentImage._id
				}, (err, chunk) => {
					Image.findOneAndUpdate({_id: parentImage._id}, {$push: {chunks: chunk._id}}, {new: true}, (err, image) => {
						console.timeEnd(`createChunk.${parentImage._id}.${x}.${y}`);
						resolve();
						if(err){
							reject(err);
							throw err;
						}
					});
				});
			});


			writeStream.on('error', (err) => {
				reject(err);
				throw err;
			});
			copy.getBuffer(image.getMIME(), (err, buffer) => {
				writeStream.end(buffer);
			});
		});
	});
}

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

module.exports = ImageRouter;