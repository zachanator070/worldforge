const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pinSchema = Schema({
	x: {
		type: Number,
		required: [true, 'x position required']
	},
	y: {
		type: Number,
		required: [true, 'y position required']
	},
	world: {
		type: mongoose.Schema.ObjectId,
		required: [true, 'world field required'],
		ref: 'World'
	},
	map: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Image'
	}],
	page: {
		type: mongoose.Schema.ObjectId,
		ref: 'WikiPage'
	}
});

const Pin = mongoose.model('Pin', pinSchema);

module.exports = Pin;
