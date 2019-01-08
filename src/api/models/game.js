
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
	world: {
		type: mongoose.Schema.ObjectId,
		ref: 'World',
		required: [true, 'worldId required']
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
	strokes: [Schema({
		path: [Schema({
			x: Number,
			y: Number,
		})],
		color: Schema({
			r: Number,
			g: Number,
			b: Number,
			a: Number
		}),
		size: Number,
		filled: Boolean,
		type: {
			type: String,
			enum: ['circle', 'square', 'erase']
		}
	})],
	messages:[Schema({
		sender:{
			type: String,
			required: [true, 'sender required']
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
