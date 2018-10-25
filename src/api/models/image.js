
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = Schema({
	world: {
		type: mongoose.Schema.ObjectId,
		ref: 'World'
	}
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
