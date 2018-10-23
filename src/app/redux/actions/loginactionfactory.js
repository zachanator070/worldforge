
class LoginActionFactory{
	static LOGIN_START = 'LOGIN_START';
	static LOGIN_SUCCESS = 'LOGIN_SUCCESS';
	static LOGIN_ERROR = 'LOGIN_ERROR';

	static CLEAR_LOGIN_ERROR = 'CLEAR_LOGIN_ERROR';

	static LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
	static LOGOUT_ERROR = 'LOGOUT_ERROR';

	static tryLogin(username, password) {
		return async (dispatch, getState, apiClient) => {
			try{
				dispatch(this.createLoginStartAction());
				dispatch(this.createClearLoginError());
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

	static createLoginStartAction(){
		return {
			type: LoginActionFactory.LOGIN_START
		}
	}

	static createLoginErrorAction(error){
		return {
			type: LoginActionFactory.LOGIN_ERROR,
			error: error
		};
	}

	static createLoginSuccessAction(user) {
		return {
			type: LoginActionFactory.LOGIN_SUCCESS,
			user: user
		}
	}

	static tryLogout(){
		return async (dispatch, getState, apiClient) => {
			try{
				await apiClient.logout();
				dispatch(this.createLogoutSuccessAction());
			} catch(error){
				dispatch(this.createLogoutActionError(error.error))
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

	static createClearLoginError(){
		return {
			type: LoginActionFactory.CLEAR_LOGIN_ERROR
		}
	}
}

export default LoginActionFactory;