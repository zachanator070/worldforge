const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const worldSchema = Schema({
	name: String,
	readUsers: [String],
	writeUsers: [String],
	public: Boolean,
	owner: String
});

const World = mongoose.model('World', worldSchema);

module.exports = World;
