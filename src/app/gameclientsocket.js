import GameActionFactory from "./redux/actions/gameactionfactory";

class GameClientSocket {

	constructor(socket, store){
		this.socket = socket;
		this.store = store;
	}

	initialize(){
		this.socket.on(GameActionFactory.SET_GAME, (game) => {
			this.store.dispatch(GameActionFactory.setGame(game));
		});

	}
}

export default GameClientSocket;