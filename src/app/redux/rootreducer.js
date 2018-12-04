import LoginActionFactory from "./actions/loginactionfactory";
import RegisterActionFactory from "./actions/registeractionfactory";
import WorldActionFactory from "./actions/worldactionfactory";
import UIActionFactory from "./actions/uiactionfactory";
import WikiActionFactory from "./actions/wikiactionfactory";
import MapActionFactory from "./actions/mapactionfactory";
import GameActionFactory from "./actions/gameactionfactory";

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
				else if (action.user && (state.owner._id !== action.user._id && !state.readUsers.includes(action.user._id))){
					return null;
				}
				return state;
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

	uiReducer(state = {
		showLoginModal: false,
		showRegisterModal: false,
		showSelectWorldModal: false,
		showCreateWorldModal: false,
		showWorldPermissionModal: false,
		showLeftDrawer: false,
		showRightDrawer: false,
		showEditPinModal: false,
		mapUploadStatus: null,
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
			case UIActionFactory.SHOW_LEFT_DRAWER:
				return Object.assign({}, state, {
					showLeftDrawer: action.show
				});
			case UIActionFactory.SHOW_RIGHT_DRAWER:
				return Object.assign({}, state, {
					showRightDrawer: action.show
				});
			case UIActionFactory.SHOW_EDIT_PIN_MODAL:
				return Object.assign({}, state, {
					showEditPinModal: action.show
				});
			case UIActionFactory.SHOW_SESSION_TIMEOUT_MODAL:
				return Object.assign({}, state, {
					showEditPinModal: action.show
				});
			case UIActionFactory.SET_MAP_UPLOAD_STATUS:
				return Object.assign({}, state, {
					mapUploadStatus: action.status
				});
			default:
				return state;
		}
	}

	currentMapReducer(state = {
		image: null,
		chunks: [],
		x: 0,
		y: 0,
		zoom: 1,
		pins: []
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
			case MapActionFactory.SET_PINS:
				return Object.assign({}, state, {
					pins: action.pins
				});
			default:
				return state;
		}
	}

	allPinsReducer(state = [], action){
		switch (action.type) {
			case MapActionFactory.SET_PINS:
					return action.pins;
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

	wikiSearchResultsReducer(state = [], action){
		switch (action.type) {
			case WikiActionFactory.SET_WIKI_SEARCH_RESULTS:
				return action.results;
			default:
				return state;
		}
	}

	displayWikiReducer(state = null, action){
		switch (action.type) {
			case WikiActionFactory.SET_DISPLAY_WIKI:
				return action.wiki;
			default:
				return state;
		}
	}

	allWikisReducer(state = [], action){
		switch (action.type) {
			case WikiActionFactory.SET_ALL_WIKIS:
				return action.results;
			default:
				return state;
		}
	}

	pinBeingEditedReducer(state = null, action){
		switch (action.type) {
			case MapActionFactory.SET_PIN_BEING_EDITED:
				return action.pin;
			default:
				return state;
		}
	}

	currentGameReducer(state = {
		game: null,
		x: 0,
		y: 0,
		zoom: 1
	}, action){
		switch(action.type){
			case GameActionFactory.SET_GAME:
				return Object.assign({}, state, {
					game: action.game
				});
			case GameActionFactory.SET_GAME_MAP_POSITION:
				return Object.assign({}, state, {
					x: action.x,
					y: action.y
				});
			case GameActionFactory.SET_GAME_MAP_ZOOM:
				return Object.assign({}, state, {
					zoom: action.zoom
				});
			default:
				return state;
		}
	}

	getCombinedReducers() {
		return this.combineReducers({
			currentUser: this.currentUserReducer,
			currentWorld: this.currentWorldReducer,
			currentMap: this.currentMapReducer,
			allPins: this.allPinsReducer,
			currentWiki: this.currentWikiReducer,
			wikiSearchResults: this.wikiSearchResultsReducer,
			ui: this.uiReducer,
			displayWiki: this.displayWikiReducer,
			availableWorlds: this.availableWorldsReducer,
			allWikis: this.allWikisReducer,
			pinBeingEdited: this.pinBeingEditedReducer,
			currentGame: this.currentGameReducer,
		});
	}
}

export default RootReducer;