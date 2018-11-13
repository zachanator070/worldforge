const express = require('express');
const mongoose = require('mongoose');
const Chunk = require('../../models/chunk');
const Image = require('../../models/image');
const Grid = require('gridfs-stream');
let ChunkRouter = express.Router();

ChunkRouter.get('/data/:id', (req, res, next) => {
	Chunk.findOne({_id: req.params.id}).populate({
		path: 'image',
		populate: {
			path: 'world'
		}
	}).exec((err, chunk) => {
		if(!chunk.image.world.userCanRead(req.user)){
			return res.status(403).json({error: 'Permission denied'});
		}
		const gfs = Grid(mongoose.connection.db, mongoose.mongo);
		gfs.files.findOne({_id: mongoose.Types.ObjectId(chunk.fileId)}, (err, file) => {
			const readstream = gfs.createReadStream({
				_id: file._id
			});
			res.set('Content-Type', file.contentType);
			return readstream.pipe(res);
		});

	});
});

ChunkRouter.get('/', (req, res, next) =>{
	if(!req.query.imageId){
		return res.status(400).json({error: 'imageId required'});
	}
	Image.findOne({_id: req.query.imageId}).populate('world').exec((err, image) => {
		if(!image.world.userCanRead(req.user)){
			return res.status(403).json({error: 'Permission denied'});
		}
		Chunk.find({image: image._id}, (err, chunks) => {
			return res.json(chunks);
		});
	});
});

module.exports = ChunkRouter;