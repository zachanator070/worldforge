import LoginActionFactory from "./actions/loginactionfactory";
import RegisterActionFactory from "./actions/registeractionfactory";
import WorldActionFactory from "./actions/worldactionfactory";
import UIActionFactory from "./actions/uiactionfactory";

class RootReducer {

	combineReducers = null;

	constructor(combineReducers){
		this.combineReducers = combineReducers;
	}

	currentUserReducer(state = null, action) {
		switch (action.type) {
			case LoginActionFactory.LOGIN_SUCCESS:
				return action.user;
			case LoginActionFactory.LOGOUT_SUCCESS:
				return null;
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
			case WorldActionFactory.SELECT_WORLD:
				return action.currentWorld;
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
			case WorldActionFactory.AVAILABLE_WORLDS_SUCCESS:
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

	getCombinedReducers() {
		return this.combineReducers({
			currentUser: this.currentUserReducer,
			currentWorld: this.currentWorldReducer,
			displayWorld: this.displayWorldReducer,
			availableWorlds: this.availableWorldsReducer,
			ui: this.uiReducer,
			loginRequest: this.loggedInReducer,
			registerRequest: this.registerReducer,
			getAvailableWorldsRequest: this.availableWorldsRequestReducer,
			createWorldRequest: this.createWorldReducer
		});
	}
}

export default RootReducer;