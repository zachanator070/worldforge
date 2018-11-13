const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const worldSchema = Schema({
	name: {
		type: String,
		required: [true, 'name field required']
	},
	readUsers: [{
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	}],
	writeUsers: [{
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	}],
	public: Boolean,
	owner: {
		type: mongoose.Schema.ObjectId,
		required: [true, 'owner field required'],
		ref: 'User'
	},
	wikiPage: {
		type: mongoose.Schema.ObjectId,
		ref: 'WikiPage'
	},
	rootFolder: {
		type: mongoose.Schema.ObjectId,
		ref: 'WikiFolder'
	}
});

worldSchema.methods.userCanRead = function (user) {
	let canRead = this.public;
	if(user === undefined || user === null){
		return canRead;
	}
	canRead = canRead || user._id.equals(this.owner._id);
	for(let userId of this.readUsers){
		canRead = canRead || userId.equals(user._id);
	}
	return canRead;
};

worldSchema.methods.userCanWrite = function (user) {
	if(user === undefined || user === null){
		return false;
	}
	let canWrite = user._id.equals(this.owner._id);
	for(let userId of this.writeUsers){
		canWrite = canWrite || userId.equals(user._id);
	}
	return canWrite;
};

const World = mongoose.model('World', worldSchema);

module.exports = World;
