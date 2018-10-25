
const express = require('express');
let WikiPageRouter = express.Router();
const WikiPage = require('../../models/wikipage.js');
const passportConfig = require('../../passport');

WikiPageRouter.get('/', (req, res, next) => {

	if(!req.query.id){
		return res.status(500).json({error: 'No wiki page id specified'});
	}
	WikiPage.find({_id: req.query.id})
		.populate({
			path: 'world coverImage mapImage',
			populate: {path: 'owner'}
		}).exec((err, page) => {
			if(err){
				return res.status(500).json({error: err})
			}

			let allowed = page.world.public;
			if(!allowed && req.user && (page.world.owner._id === req.user._id || page.world.readUsers.includes(req.user._id))){
				allowed = true;
			}
			if(!allowed){
				return res.status(403).json({error: 'Unauthorized'});
			}
			return res.json(page);
	});

});

WikiPageRouter.post('/', passportConfig.loggedInMiddleware , (req, res, next) => {

	WikiPage.create(req.body, function(err, createdWorld){
		if(err){
			return res.status(500).json(err)
		}
		return res.json(createdWorld);
	});
});

module.exports = WikiPageRouter;