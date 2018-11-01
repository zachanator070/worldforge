import LoginActionFactory from "./actions/loginactionfactory";
import RegisterActionFactory from "./actions/registeractionfactory";
import WorldActionFactory from "./actions/worldactionfactory";
import UIActionFactory from "./actions/uiactionfactory";
import WikiActionFactory from "./actions/wikiactionfactory";
import MapActionFactory from "./actions/mapactionfactory";

class RootReducer {

	combineReducers = null;

	constructor(combineReducers){
		this.combineReducers = combineReducers;
	}

	currentUserReducer(state = null, action) {
		switch (action.type) {
			case LoginActionFactory.SET_CURRENT_USER:
				return action.user;
			default:
				return state
		}
	}

	loggedInReducer(state = {
		error: null,
	}, action) {
		switch (action.type) {
			case LoginActionFactory.LOGIN_ERROR:
				return Object.assign({}, state, {
					error: action.error
				});
			default:
				return state
		}
	}

	registerReducer(state = {
		error: null,
	}, action){
		switch(action.type){
			case RegisterActionFactory.REGISTER_ERROR:
				return Object.assign({}, state, {
					error: action.error
				});
			default:
				return state
		}
	}

	currentWorldReducer(state = null, action){
		switch(action.type) {
			case WorldActionFactory.SET_CURRENT_WORLD:
				return action.currentWorld;
			case LoginActionFactory.SET_CURRENT_USER:
				if(!state){
					return state;
				}
				if(action.user === null && !state.public ){
					return null;
				}
				else if (action.user && (state.owner._id !== action.user._id || !state.readUsers.includes(action.user._id))){
					return null;
				}
				return state;
			default:
				return state;
		}
	}

	availableWorldsRequestReducer(state = {
		error: null,
	}, action){
		switch(action.type) {
			case WorldActionFactory.AVAILABLE_WORLDS_ERROR:
				return Object.assign({}, state, {
					error: action.error
				});
			default:
				return state;
		}
	}

	availableWorldsReducer(state = null, action){
		switch(action.type) {
			case WorldActionFactory.SET_AVAILABLE_WORLDS:
				return action.availableWorlds;
			default:
				return state;
		}
	}

	createWorldReducer(state = {
		error: null,
	}, action){
		switch(action.type){
			case WorldActionFactory.CREATE_WORLDS_ERROR:
				return Object.assign({}, state, {
					error: action.error
				});
			default:
				return state;
		}
	}

	uiReducer(state = {
		showLoginModal: false,
		showRegisterModal: false,
		showSelectWorldModal: false,
		showCreateWorldModal: false,
		showWorldPermissionModal: false
	}, action){
		switch(action.type){
			case UIActionFactory.SHOW_LOGIN_MODAL:
				return Object.assign({}, state, {
					showLoginModal: action.show
				});
			case UIActionFactory.SHOW_REGISTRATION_MODAL:
				return Object.assign({}, state, {
					showRegisterModal: action.show
				});
			case UIActionFactory.SHOW_WORLD_PERMISSION_MODAL:
				return Object.assign({}, state, {
					showWorldPermissionModal: action.show
				});
			case UIActionFactory.SHOW_WORLD_SELECT_MODAL:
				return Object.assign({}, state, {
					showSelectWorldModal: action.show
				});
			case UIActionFactory.SHOW_CREATE_WORLD_MODAL:
				return Object.assign({}, state, {
					showCreateWorldModal: action.show
				});
			default:
				return state;
		}
	}

	displayWorldReducer(state = null, action){
		switch(action.type){
			case WorldActionFactory.SET_DISPLAY_WORLD:
				return action.displayWorld;
			default:
				return state;
		}
	}

	currentMapReducer(state = {
		image: null,
		chunks: [],
		x: 0,
		y: 42,
		zoom: 1
	}, action){
		switch (action.type) {
			case MapActionFactory.SET_CURRENT_MAP:
				return Object.assign({}, state, {
					image: action.map
				});
			case MapActionFactory.SET_CURRENT_MAP_CHUNKS:
				return Object.assign({}, state, {
					chunks: action.chunks
				});
			case MapActionFactory.SET_CURRENT_MAP_POSITION:
				return Object.assign({}, state, {
					x: action.x,
					y: action.y
				});
			case MapActionFactory.SET_CURRENT_MAP_ZOOM:
				return Object.assign({}, state, {
					zoom: action.zoom
				});
			default:
				return state;
		}
	}

	currentWikiReducer(state = null, action){
		switch (action.type) {
			case WikiActionFactory.SET_CURRENT_WIKI:
				return action.wiki;
			default:
				return state;
		}
	}

	getCombinedReducers() {
		return this.combineReducers({
			currentUser: this.currentUserReducer,
			currentWorld: this.currentWorldReducer,
			currentMap: this.currentMapReducer,
			currentWiki: this.currentWikiReducer,
			ui: this.uiReducer,
			displayWorld: this.displayWorldReducer,
			availableWorlds: this.availableWorldsReducer,
			loginRequest: this.loggedInReducer,
			registerRequest: this.registerReducer,
			getAvailableWorldsRequest: this.availableWorldsRequestReducer,
			createWorldRequest: this.createWorldReducer,
		});
	}
}

export default RootReducer;