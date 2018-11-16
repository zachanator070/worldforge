import WorldActionFactory from "./worldactionfactory";
import UIActionFactory from "./uiactionfactory";

class LoginActionFactory{

	static SET_CURRENT_USER = 'SET_CURRENT_USER';
	static LOGIN_ERROR = 'LOGIN_ERROR';
	static LOGOUT_ERROR = 'LOGOUT_ERROR';

	static tryLogin(username, password) {
		return async (dispatch, getState, { apiClient, history}) => {
			try{
				await apiClient.login(username, password);
				let user = await apiClient.getCurrentUser();
				dispatch(this.loginSuccess(user));
			} catch (error){
				dispatch(this.createLoginErrorAction(error.message))
			}
		}
	}

	static resumeSession() {
		return async (dispatch, getState, { apiClient, history}) => {
			const authed = await apiClient.isAuthed();
			if(authed){
				let user = await apiClient.getCurrentUser();
				dispatch(LoginActionFactory.setCurrentUser(user));
			}

			await dispatch(WorldActionFactory.fetchAvailableWorlds());

			await dispatch(UIActionFactory.applyUrlQueryArgs());

			await dispatch(LoginActionFactory.loadLastSelectedWorld());

		}
	}

	static createLoginErrorAction(error){
		return {
			type: LoginActionFactory.LOGIN_ERROR,
			error: error
		};
	}

	static setCurrentUser(user){
		return {
			type: LoginActionFactory.SET_CURRENT_USER,
			user: user
		}
	}

	static loginSuccess(user) {
		return async (dispatch, getState, { apiClient, history}) => {
			dispatch(LoginActionFactory.setCurrentUser(user));

			dispatch(UIActionFactory.showLoginModal(false));

			await dispatch(WorldActionFactory.fetchAvailableWorlds());

			await dispatch(LoginActionFactory.loadLastSelectedWorld());

		}
	}

	static loadLastSelectedWorld(){
		return async (dispatch, getState, {apiClient, history}) => {
			if(getState().currentWorld === null && getState().currentUser && getState().currentUser.currentWorld){
				dispatch(UIActionFactory.gotoPage('/ui/map', {world: getState().currentUser.currentWorld}, true));
			}
		}
	}

	static tryLogout(){
		return async (dispatch, getState, { apiClient, history}) => {
			try{
				await apiClient.logout();
				dispatch(this.createLogoutSuccessAction());
				dispatch(WorldActionFactory.fetchAvailableWorlds());
			} catch(error){
				dispatch(this.createLogoutActionError(error.message))
			}
		}
	}

	static createLogoutSuccessAction() {
		return {
			type: LoginActionFactory.SET_CURRENT_USER,
			user: null
		}
	}

	static createLogoutActionError(error){
		return {
			type: LoginActionFactory.LOGOUT_ERROR,
			error: error
		};
	}
}

export default LoginActionFactory;