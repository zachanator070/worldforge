import LoginActionFactory from "./loginactionfactory";
import UIActionFactory from "./uiactionfactory";

class RegisterActionFactory {

	static REGISTER_ERROR = 'REGISTER_ERROR';

	static tryRegister(email, password, display) {
		return async (dispatch, getState, { apiClient, history}) => {
			try{
				await apiClient.register(email, password, display);
				dispatch(LoginActionFactory.resumeSession());
				dispatch({
					type: UIActionFactory.SHOW_REGISTRATION_MODAL,
					show: false
				});
			} catch (error) {
				dispatch({
					type: RegisterActionFactory.REGISTER_ERROR,
					error: error.error || error.message
				});
			}
		};
	}
}

export default RegisterActionFactory;