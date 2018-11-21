
class GameActionFactory {

	static SET_GAME = 'SET_GAME';
	static SET_GAME_MAP_POSITION = 'SET_GAME_MAP_POSITION';
	static SET_GAME_MAP_ZOOM = 'SET_GAME_MAP_ZOOM';

	static joinGame(gameId, password){
		return async (dispatch, getState, { apiClient, history, socket}) => {
			socket.emit('JOIN_GAME', getState().currentUser._id, gameId, password, (error, game) => {
				dispatch(GameActionFactory.setGame(game));
			});
		}
	}

	static createGame(password){
		return async (dispatch, getState, { apiClient, history, socket}) => {
			if(password === ''){
				password = null;
			}
			socket.emit('CREATE_GAME', {passwordHash: password}, (error, game) => {
				if(!error){
					socket.emit('JOIN_GAME', getState().currentUser._id, game._id, (error, game) => {
						dispatch(GameActionFactory.setGame(game));
					});
				}
			});
		}
	}

	static setGame(game){
		return {
			type: GameActionFactory.SET_GAME,
			game: game
		}
	}

	static setGameMapPosition(x, y){
		return {
			type: GameActionFactory.SET_GAME_MAP_POSITION,
			x: x,
			y: y
		}
	}

	static setGameMapZoom(zoom){
		return {
			type: GameActionFactory.SET_GAME_MAP_ZOOM,
			zoom: zoom
		}
	}
}

export default GameActionFactory;