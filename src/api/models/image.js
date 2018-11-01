
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = Schema({
	world: {
		type: mongoose.Schema.ObjectId,
		ref: 'World',
		required: [true, 'worldId required']
	},
	width: {
		type: Number,
		required: [true, 'width required']
	},
	height: {
		type: Number,
		required: [true, 'width required']
	},
	chunkWidth: {
		type: Number,
		required: [true, 'chunkWidth required']
	},
	chunkHeight: {
		type: Number,
		required: [true, 'chunkHeight required']
	}
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
