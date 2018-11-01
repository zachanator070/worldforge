import WorldActionFactory from "./worldactionfactory";
import queryString from "query-string";
import LoginActionFactory from "./loginactionfactory";
import MapActionFactory from "./mapactionfactory";

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
			if(!show){
				dispatch(WorldActionFactory.displayWorld(null))
			}
		}
	}

	static submitSelectWorldModal(worldId){
		return async (dispatch, getState, {apiClient, history}) => {

			let world = await apiClient.getWorld(worldId);

			if(getState().currentUser && world && getState().currentUser.currentWorld !== world._id){
				const newUser = await apiClient.setCurrentWorld(world);
				dispatch({
					type: LoginActionFactory.SET_CURRENT_USER,
					user: newUser
				});
			}
			dispatch(UIActionFactory.showSelectWorldModal(false));
			dispatch(UIActionFactory.gotoPage('/ui/map', {world: world._id}));
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
				type: UIActionFactory.SHOW_WORLD_SELECT_MODAL,
				show: show,
			});
		}
	}

	static gotoPage(url, queryArgs = null){
		return async (dispatch, getState, {apiClient, history}) => {
			if(!queryArgs){
				queryArgs = queryString.parse(history.location.search);
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
					dispatch(WorldActionFactory.findAndSetCurrentWorld(queryArgs.world));
				}
			}

			if(queryArgs.map){
				if(!getState().currentMap.map || getState().currentMap.map._id !== queryArgs.map){
					dispatch(MapActionFactory.getAndSetMap(queryArgs.map))
				}
			}

			if(queryArgs.wiki){
				if(!getState().currentWiki || getState().currentWiki._id !== queryArgs.wiki){
					dispatch(MapActionFactory.getAndSetMap(queryArgs.wiki))
				}
			}
		}
	}

	static redirectAfterWorldChange(){
		return async (dispatch, getState, {apiClient, history}) => {

			if(getState().currentWorld){
				if(history.location.pathname === '/ui/' || history.location.pathname === '/ui/map/'){
					if(getState().currentWorld.wikiPage.mapImage){
						dispatch(UIActionFactory.gotoPage('/ui/map/',{world: getState().currentWorld._id, map: getState().currentWorld.wikiPage.mapImage._id}));
					}
					else{
						dispatch(UIActionFactory.gotoPage('/ui/map/',{world: getState().currentWorld._id}));
					}
				}
				else{
					dispatch(UIActionFactory.gotoPage(history.location.pathname, {world: getState().currentWorld._id}));
				}

			}
			else {
				// clear url params if we are clearing current world
				dispatch(UIActionFactory.gotoPage(history.location.pathname, {}));
			}
		}
	}
}

export default UIActionFactory;