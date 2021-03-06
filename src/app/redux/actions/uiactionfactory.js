import WorldActionFactory from "./worldactionfactory";
import queryString from "query-string";
import LoginActionFactory from "./loginactionfactory";
import MapActionFactory from "./mapactionfactory";
import WikiActionFactory from "./wikiactionfactory";
import {message} from "antd";

class UIActionFactory {

	static SHOW_LOGIN_MODAL = 'SHOW_LOGIN_MODAL';
	static SHOW_REGISTRATION_MODAL = 'SHOW_REGISTER_MODAL';
	static SHOW_WORLD_SELECT_MODAL = 'SHOW_WORLD_SELECT_MODAL';
	static SHOW_WORLD_PERMISSION_MODAL = 'SHOW_WORLD_PERMISSION_MODAL';
	static SHOW_CREATE_WORLD_MODAL = 'SHOW_CREATE_WORLD_MODAL';
	static SHOW_LEFT_DRAWER = 'SHOW_LEFT_DRAWER';
	static SHOW_RIGHT_DRAWER = 'SHOW_RIGHT_DRAWER';
	static SHOW_EDIT_PIN_MODAL = 'SHOW_EDIT_PIN_MODAL';
	static SET_MAP_UPLOAD_STATUS = 'SET_MAP_UPLOAD_STATUS';

	static showLoginModal(show){
		return {
			type: UIActionFactory.SHOW_LOGIN_MODAL,
			show: show,
		};
	}

	static showRegistrationModal(show){
		return (dispatch, getState, { apiClient, history}) => {
			dispatch({
				type: UIActionFactory.SHOW_REGISTRATION_MODAL,
				show: show,
			});
		}
	}

	static showSelectWorldModal(show){
		return (dispatch, getState, { apiClient, history}) => {
			dispatch({
				type: UIActionFactory.SHOW_WORLD_SELECT_MODAL,
				show: show,
			});
		}
	}

	static  submitSelectWorldModal(worldId){
		return async (dispatch, getState, {apiClient, history}) => {
			try{
				let world = await apiClient.getWorld(worldId);

				if(getState().currentUser && world && getState().currentUser.currentWorld !== world._id){
					const newUser = await apiClient.setCurrentWorld(world);
					dispatch({
						type: LoginActionFactory.SET_CURRENT_USER,
						user: newUser
					});
				}
				dispatch(UIActionFactory.showSelectWorldModal(false));
				dispatch(UIActionFactory.gotoPage('/ui/map', {world: world._id}, true));
			} catch(e){
				UIActionFactory.showError(e);
			}

		}
	}

	static showCreateWorldModal(show){
		return (dispatch, getState, { apiClient, history}) => {
			dispatch({
				type: UIActionFactory.SHOW_CREATE_WORLD_MODAL,
				show: show,
			});
		}
	}

	static showWorldPermissionModal(show){
		return (dispatch, getState, { apiClient, history}) => {
			dispatch({
				type: UIActionFactory.SHOW_WORLD_PERMISSION_MODAL,
				show: show,
			});
		}
	}

	static gotoPage(url, queryArgs = {}, override = false){
		return async (dispatch, getState, {apiClient, history}) => {
			if(!override){
				queryArgs = Object.assign({}, queryString.parse(history.location.search), queryArgs);
			}
			if(!url){
				url = history.location.pathname
			}
			history.push(url + '?' + Object.keys(queryArgs).map((key) => {return key + '=' + queryArgs[key]}).join('&'));
			dispatch(UIActionFactory.applyUrlQueryArgs(queryArgs));
		}
	}

	static applyUrlQueryArgs(queryArgs = null){
		return async (dispatch, getState, {apiClient, history}) => {
			if(!queryArgs){
				queryArgs = queryString.parse(history.location.search);
			}

			if(queryArgs.world){
				if(!getState().currentWorld || getState().currentWorld._id !== queryArgs.world){
					await dispatch(WorldActionFactory.getAndSetCurrentWorld(queryArgs.world));
				}
			}

			if(queryArgs.map){
				if(!getState().currentMap.map || getState().currentMap.map._id !== queryArgs.map){
					await dispatch(MapActionFactory.getAndSetMap(queryArgs.map))
				}
			}

			if(queryArgs.wiki){
				if(!getState().currentWiki || getState().currentWiki._id !== queryArgs.wiki){
					await dispatch(WikiActionFactory.getAndSetWiki(queryArgs.wiki))
				}
			}
		}
	}

	static showLeftDrawer(show){
		return {
			type: UIActionFactory.SHOW_LEFT_DRAWER,
			show: show
		};
	}

	static showRightDrawer(show){
		return {
			type: UIActionFactory.SHOW_RIGHT_DRAWER,
			show: show
		};
	}

	static showEditPinModal(show){
		return {
			type: UIActionFactory.SHOW_EDIT_PIN_MODAL,
			show: show
		}
	}

	static setMapUploadStatus(status){
		return {
			type: UIActionFactory.SET_MAP_UPLOAD_STATUS,
			status: status
		}
	}

	static showError(error){
		message.error(error.message || error.error);
	}
}

export default UIActionFactory;