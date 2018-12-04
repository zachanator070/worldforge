import UIActionFactory from "./uiactionfactory";

class GameActionFactory {

	static SET_GAME = 'SET_GAME';
	static SET_GAME_MAP_POSITION = 'SET_GAME_MAP_POSITION';
	static SET_GAME_MAP_ZOOM = 'SET_GAME_MAP_ZOOM';

	static joinGame(gameId, password){
		return async (dispatch, getState, { apiClient, history, socket}) => {
			socket.emit('JOIN_GAME', getState().currentUser._id, gameId, password, (error, game) => {
				if(error){
					UIActionFactory.showError(error);
				}
				else{
					dispatch(UIActionFactory.showLeftDrawer(false));
					dispatch(UIActionFactory.showRightDrawer(false));
					dispatch(GameActionFactory.setGame(game));
				}
			});
		}
	}

	static leaveGame(){
		return async (dispatch, getState, { apiClient, history, socket}) => {
			socket.emit('LEAVE_GAME', (error) => {
				if(error){
					UIActionFactory.showError(error);
				}
				else{
					dispatch(UIActionFactory.showLeftDrawer(false));
					dispatch(UIActionFactory.showRightDrawer(false));
					dispatch(GameActionFactory.setGame(null));
				}
			});
		}
	}

	static createGame(worldId, password){
		return async (dispatch, getState, { apiClient, history, socket}) => {
			if(password === ''){
				password = null;
			}
			socket.emit('CREATE_GAME', {world: worldId, passwordHash: password}, (error, game) => {
				if(!error){
					dispatch(GameActionFactory.joinGame(game._id, password));
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

	static setMap(imageId){
		return async (dispatch, getState, { apiClient, history, socket}) => {
			socket.emit('SET_GAME_MAP', imageId, (error, game) => {
				if(error){
					UIActionFactory.showError(error);
				}
				else{
					dispatch(GameActionFactory.setGame(game));
				}
			});
		}
	}

	static sendMessage(message){
		return async (dispatch, getState, { apiClient, history, socket}) => {
			socket.emit('GAME_MESSAGE', message, (error, game) => {
				if(error){
					UIActionFactory.showError(error);
				}
				else{
					dispatch(GameActionFactory.setGame(game));
				}
			});
		}
	}
}

export default GameActionFactory;