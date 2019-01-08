
const Game = require('./models/game');
const User = require('./models/user');

const systemSender = "World Forge";

const commands = [
	{
		regex: /\/roll \d+d\d+/,
		exec: (sender, message) => {
			let parts = message.split(' ');
			if(parts.length === 2){
				const dicePart = parts[1];
				parts = parts[1].split('d');
				if(parts.length === 2){
					let numDie = parseInt(parts[0]);
					const die = parseInt(parts[1]);
					const results = [];
					for(;numDie > 0; numDie--){
						results.push(Math.floor(Math.random() * Math.floor(die)) + 1);
					}
					return `${sender} rolled ${dicePart} and got ${JSON.stringify(results)} = ${results.reduce((a, b) => a + b, 0)}`;
				}
			}
		}
	}
];

class GameServerSocket {
	constructor(io){
		this.io = io;
	}

	populateGame(game, callback){
		if(!game){
			return;
		}
		game.populate({
			path: 'mapImage',
			populate:{
				path: 'chunks'
			}
		}).populate({
			path: 'world',
			populate: {
				path: 'owner',
				select: 'displayName'
			}
		}).populate({
			path: 'players.player',
		}).populate({
			path: 'icons',
			populate:{
				path: 'image'
			}
		}).populate({
			path: 'paths',
		}, (err, game) => {
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

					if(game.passwordHash && !game.validPassword(password)){
						callback(new Error('Wrong password'));
						return;
					}

					this.populateGame(game, (error, game) => {
						User.findOne({_id: userId}, (error, user) => {
							if(!game.world.userCanRead(user)){
								callback(new Error('You do not gave permission to this game world'));
								return;
							}
							game.players.push({player: userId, socketId: socket.id});
							game.messages.push({
								sender: systemSender,
								message: `${user.displayName} has joined`,
								timeStamp: (new Date()).toUTCString()
							});
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
						});
					});
				});
			});

			socket.on('LEAVE_GAME', (callback) => {
				Game.findOne({'players.socketId': socket.id}, (error, game) => {
					if(error){
						callback(error);
						return;
					}
					this.populateGame(game, (error, newGame) => {
						if(error){
							callback(error);
							return;
						}
						const player = newGame.players.filter((player) => {return player.socketId === socket.id})[0].player;
						Game.findOneAndUpdate({'players.socketId': socket.id},
							{
								$pull: {players: {socketId: socket.id}},
								$push: {messages:{
										sender: systemSender,
										message: `${player.displayName} has left`,
										timeStamp: (new Date()).toUTCString()
									}}
							},
							{new: true},
							(error, game) => {
								if(error){
									callback(error);
									return;
								}
								this.populateGame(game, (error, newGame) => {
									socket.broadcast.emit('SET_GAME', newGame);
									callback(error);
								});
							}
						);
					});
				});
			});

			socket.on('SET_GAME_MAP', (imageId, callback) => {
				Game.findOneAndUpdate({'players.socketId': socket.id}, {$set: {mapImage: imageId}}, {new: true},(error, game) => {

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

			socket.on('GAME_MESSAGE', (message, callback) => {
				Game.findOne({'players.socketId': socket.id}, (error, game) => {

					if(error){
						callback(error);
					}
					else{
						this.populateGame(game, (err, newGame) => {
							if(err){
								callback(err, newGame);
								return;
							}
							const player = newGame.players.filter((player) => {return player.socketId === socket.id})[0].player;
							newGame.messages.push({
								sender: player.displayName,
								message: message,
								timeStamp: (new Date()).toUTCString()
							});
							const parsedMessage = this.parseCommand(player.displayName, message);
							if(message !== parsedMessage){
								newGame.messages.push({
									sender: systemSender,
									message: parsedMessage,
									timeStamp: (new Date()).toUTCString()
								});
							}
							newGame.save((error) => {
								if(!error){
									socket.broadcast.emit('SET_GAME', newGame);
								}
								this.populateGame(newGame, callback);
							});

						});
					}
				});
			});

			socket.on('reconnect', () => {
				console.log(`${socket.id} reconnected`);
			});

			socket.on('disconnect', () => {
				Game.findOne({'players.socketId': socket.id}, (error, game) => {
					if(game){
						this.populateGame(game, (error, newGame) => {
							const player = newGame.players.filter((player) => {return player.socketId === socket.id})[0].player;
							Game.findOneAndUpdate({'players.socketId': socket.id},
								{
									$pull: {players: {socketId: socket.id}},
									$push: {messages:{
											sender: systemSender,
											message: `${player.displayName} has left`,
											timeStamp: (new Date()).toUTCString()
										}}
								},
								{new: true},
								(error, game) => {
									this.populateGame(game, (error, newGame) => {
										socket.broadcast.emit('SET_GAME', newGame);
									});
								}
							);
						});
					}
				});
			});
		});
	}

	parseCommand(sender, message) {
		for(let command of commands){
			if(message.search(command.regex) !== -1){
				return command.exec(sender, message);
			}
		}
		if(message.search('/') === 0 ){
			return `Command not recognized: ${message}`;
		}
		return message;
	}
}

module.exports = GameServerSocket;