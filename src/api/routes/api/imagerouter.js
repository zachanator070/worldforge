
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

	Jimp.read(req.files.data.data)
		.then(image => {
			newImageSchema.width = image.bitmap.width;
			newImageSchema.height = image.bitmap.height;
			let x = 0;
			let y = 0;
			let chunkJobs = [];
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

				}))
			}

			Promise.all(chunkPromises).then((chunks) => {
				Image.create(newImageSchema, (err, newImage) => {
					const createChunkPromises = [];
					for (let chunk of chunks){
						chunk.image = newImage._id;
						createChunkPromises.push(Chunk.create(chunk));
					}
					Promise.all(createChunkPromises).then((chunks) => {
						return res.json(newImage);
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
		path: 'world owner wikiPage',
		populate: {path: 'coverImage mapImage world'}
	}).exec((err, image) => {
		if((req.user &&!image.world.userCanRead(req.user)) && !image.world.public){
			return res.status(403).json({error: 'You do not have permission to read'})
		}

		res.json(image);
	});
});

module.exports = ImageRouter;