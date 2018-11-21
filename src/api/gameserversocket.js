
const Game = require('./models/game');

class GameServerSocket {
	constructor(io){
		this.io = io;
	}

	populateGame(game, callback){
		Game.findOne({_id: game._id}).populate({
			path: 'mapImage world players icons paths messages',
			populate: {
				path: 'image sender'
			}
		}).exec((err, game) => {
			callback(err, game);
		});
	}

	setup(){
		this.io.on('connection', (socket) => {
			socket.on('CREATE_GAME', (game, callback) => {
				let password = game.password;
				if(game.password){
					delete game.password;
				}
				Game.create(game, (error, newGame) => {
					if(error){
						callback(error);
					}
					if(password){
						newGame.passwordHash = password;
						newGame.save((saveError) => {
							callback(saveError, newGame);
						});
					}
					else{
						callback(error, newGame);
					}
				});
			});

			socket.on('JOIN_GAME', (userId, gameId, password, callback) => {
				Game.findOne({_id: gameId}, (error, game) => {
					if(error){
						callback(error);
						return;
					}

					if(!game.passwordHash && game.validPassword(password)){
						callback(new Error('Wrong password'));
						return;
					}

					else {
						game.players.push({player: userId, socketId: socket.id});
						game.save((err) => {
							if(err){
								callback(err);
							}
							else{
								socket.join(gameId, (error) => {
									if(error){
										callback(error);
									}
									else{
										this.populateGame(game, (err, newGame) => {
											if(!err){
												socket.broadcast.emit('SET_GAME', newGame);
											}
											callback(err, newGame);
										});
									}
								});
							}
						});
					}
				});
			});

			socket.on('LEAVE_GAME', (userId, gameId, callback) => {
				Game.findOneAndUpdate({_id: gameId}, {$pull: {players: userId}}, (error, game) => {

					if(error){
						callback(error);
					}
					else {
						socket.leave(gameId, (error) => {
							if(error){
								callback(error);
							}
							else{
								this.populateGame(game, (err, newGame) => {
									if(!err){
										socket.broadcast.emit('SET_GAME', newGame);
									}
									callback(err, newGame);
								});
							}
						});
					}
				});
			});

			socket.on('SET_GAME_MAP', (imageId, callback) => {
				Game.findOneAndUpdate({players: {socketId: socket.id}}, {mapImage: imageId}, (error, game) => {

					if(error){
						callback(error);
					}
					else{
						this.populateGame(game, (err, newGame) => {
							if(!err){
								socket.broadcast.emit('SET_GAME', newGame);
							}
							callback(err, newGame);
						});
					}
				});
			});

			socket.on('MESSAGE', (message, callback) => {
				Game.findOne({players: {socketId: socket.id}}, (error, game) => {

					if(error){
						callback(error);
					}
					else{
						this.populateGame(game, (err, newGame) => {
							if(err){
								callback(err, newGame);
								return;
							}
							const player = newGame.players.filter((player) => {return player.socketId === socket.id})[0];
							newGame.message.push({
								sender: player._id,
								message: message,
								timestamp: (new Date()).toUTCString()
							});
							newGame.save((error) => {
								if(!error){
									socket.broadcast.emit('SET_GAME', newGame);
								}
								callback(error, newGame);
							});

						});
					}
				});
			});
		});
	}
}

module.exports = GameServerSocket;