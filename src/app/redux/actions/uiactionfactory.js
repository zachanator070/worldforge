import WorldActionFactory from "./worldactionfactory";

class UIActionFactory {

	static SHOW_LOGIN_MODAL = 'SHOW_LOGIN_MODAL';
	static SHOW_REGISTRATION_MODAL = 'SHOW_REGISTER_MODAL';
	static SHOW_WORLD_SELECT_MODAL = 'SHOW_WORLD_SELECT_MODAL';
	static SHOW_WORLD_PERMISSION_MODAL = 'SHOW_WORLD_PERMISSION_MODAL';
	static SHOW_CREATE_WORLD_MODAL = 'SHOW_CREATE_WORLD_MODAL';

	static showLoginModal(show){
		return {
			type: UIActionFactory.SHOW_LOGIN_MODAL,
			show: show,
		};
	}

	static showRegistrationModal(show){
		return (dispatch, getState, api) => {
			dispatch({
				type: UIActionFactory.SHOW_REGISTRATION_MODAL,
				show: show,
			});
		}
	}

	static showSelectWorldModal(show){
		return (dispatch, getState, api) => {
			dispatch({
				type: UIActionFactory.SHOW_WORLD_SELECT_MODAL,
				show: show,
			});
			if(!show){
				dispatch(WorldActionFactory.displayWorld(null))
			}
		}
	}

	static showCreateWorldModal(show){
		return (dispatch, getState, api) => {
			dispatch({
				type: UIActionFactory.SHOW_CREATE_WORLD_MODAL,
				show: show,
			});
		}
	}

	static showWorldPermissionModal(show){
		return (dispatch, getState, api) => {
			dispatch({
				type: UIActionFactory.SHOW_WORLD_SELECT_MODAL,
				show: show,
			});
		}
	}
}

export default UIActionFactory;