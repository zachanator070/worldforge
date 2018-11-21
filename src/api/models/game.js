
const mongoose = require('mongoose');
const sha256 = require('js-sha256');
const Schema = mongoose.Schema;

const setPassword = (password) => {
	return sha256.sha256(password);
};

const gameSchema = Schema({
	password_hash: {
		type: String,
		set: setPassword
	},
	mapImage: {
		type: mongoose.Schema.ObjectId,
		ref: 'Image',
	},
	players: [Schema({
		socketId: {
			type: String,
			required: [true, 'socketId required']
		},
		player: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'player id required']
		}
	})],
	icons: [Schema({
		image: {
			type: mongoose.Schema.ObjectId,
			ref: 'Image',
			required: [true, 'icon image id required']
		},
		x: {
			type: Number,
			required: [true, 'x position required']
		},
		y: {
			type: Number,
			required: [true, 'y position required']
		}
	})],
	paths: [Schema({
		path: [[Number, Number]],
		color: String,
		size: Number,
		filled: Boolean
	})],
	messages:[Schema({
		sender:{
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'icon image id required']
		},
		message: {
			type: String,
			required: [true, 'icon image id required']
		},
		timeStamp: {
			type: String,
			required: [true, 'icon image id required']
		}
	})]
});

gameSchema.methods.validPassword = function (password) {
	return sha256.sha256(password) === this.password_hash;
};


const Game = mongoose.model('Game', gameSchema);

module.exports = Game;