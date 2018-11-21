import WorldActionFactory from "./worldactionfactory";
import UIActionFactory from "./uiactionfactory";

class LoginActionFactory {

	static SET_CURRENT_USER = 'SET_CURRENT_USER';

	static tryLogin(username, password) {
		return async (dispatch, getState, { apiClient, history}) => {
			try {
				await apiClient.login(username, password);
				let user = await apiClient.getCurrentUser();
				dispatch(LoginActionFactory.setCurrentUser(user));

				dispatch(UIActionFactory.showLoginModal(false));

				await dispatch(WorldActionFactory.fetchAvailableWorlds());
				await dispatch(LoginActionFactory.loadLastSelectedWorld());

			} catch (error) {
				UIActionFactory.showError(error);
			}
		}
	}

	static resumeSession() {
		return async (dispatch, getState, { apiClient, history}) => {
			try {
				const authed = await apiClient.isAuthed();
				if(authed){
					let user = await apiClient.getCurrentUser();
					dispatch(LoginActionFactory.setCurrentUser(user));
				}

				await dispatch(WorldActionFactory.fetchAvailableWorlds());

				await dispatch(UIActionFactory.applyUrlQueryArgs());

				await dispatch(LoginActionFactory.loadLastSelectedWorld());
			} catch (e) {
				UIActionFactory.showError(e);
			}

		}
	}

	static setCurrentUser(user){
		return {
			type: LoginActionFactory.SET_CURRENT_USER,
			user: user
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
				dispatch(this.setCurrentUser(null));
				dispatch(WorldActionFactory.fetchAvailableWorlds());
			} catch (e) {
				UIActionFactory.showError(e);
			}
		}
	}
}

export default LoginActionFactory;