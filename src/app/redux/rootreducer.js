import LoginActionFactory from "./actions/loginactionfactory";

class RootReducer {

	combineReducers = null;

	constructor(combineReducers){
		this.combineReducers = combineReducers;
	}

	loggedInReducer(state = {isFetching: false, error: null, user: null}, action) {
		switch (action.type) {
			case LoginActionFactory.LOGIN_START:
				return Object.assign({}, state, {
					isFetching: true
				});
			case LoginActionFactory.LOGIN_SUCCESS:
				return Object.assign({}, state, {
					isFetching: false,
					user: action.user
				});
			case LoginActionFactory.LOGIN_ERROR:
				return Object.assign({}, state, {
					isFetching: false,
					error: action.error
				});
			case LoginActionFactory.LOGOUT_SUCCESS:
				return Object.assign({}, state, {
					user: null
				});
			case LoginActionFactory.CLEAR_LOGIN_ERROR:
				return Object.assign({}, state, {
					error: null
				});
			default:
				return state
		}
	}

	getCombinedReducers() {
		return this.combineReducers({
			loggedIn: this.loggedInReducer,

		});
	}
}

export default RootReducer;