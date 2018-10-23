const express = require('express');
const UiRouter = express.Router();
const path = require('path');
const passport = require("passport");

UiRouter.use(express.static(path.join(__dirname+'../../../../../dist')));

UiRouter.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname+'../../../../../dist/index.html'));
});

module.exports = UiRouter;