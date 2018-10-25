import WorldActionFactory from "./worldactionfactory";
import UIActionFactory from "./uiactionfactory";

class LoginActionFactory{

	static LOGIN_SUCCESS = 'LOGIN_SUCCESS';
	static LOGIN_ERROR = 'LOGIN_ERROR';

	static LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
	static LOGOUT_ERROR = 'LOGOUT_ERROR';

	static tryLogin(username, password) {
		return async (dispatch, getState, apiClient) => {
			try{
				await apiClient.login(username, password);
				let user = await apiClient.getCurrentUser();
				dispatch(this.createLoginSuccessAction(user));
			} catch (error){
				dispatch(this.createLoginErrorAction(error.message))
			}
		}
	}

	static resumeSession() {
		return async (dispatch, getState, apiClient) => {
			try{
				let user = await apiClient.getCurrentUser();
				dispatch(this.createLoginSuccessAction(user));
			} catch(error){

			}
		}
	}

	static createLoginErrorAction(error){
		return {
			type: LoginActionFactory.LOGIN_ERROR,
			error: error
		};
	}

	static createLoginSuccessAction(user) {
		return async (dispatch, getState, api) => {
			dispatch({
				type: LoginActionFactory.LOGIN_SUCCESS,
				user: user
			});
			dispatch(UIActionFactory.showLoginModal(false));
			let world = getState().currentWorld;
			if(getState().currentWorld){
				world = await api.getWorld(user.currentWorld);
			}
			if(world === null || world._id !== user.currentWorld){
				dispatch(WorldActionFactory.selectWorld(world));
			}
			dispatch(WorldActionFactory.fetchAvailableWorlds());
		}
	}

	static tryLogout(){
		return async (dispatch, getState, apiClient) => {
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
			type: LoginActionFactory.LOGOUT_SUCCESS
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