import UIActionFactory from "./uiactionfactory";
import LoginActionFactory from "./loginactionfactory";
import ApiClient from "../../apiclient";
import ApiError from "../../exceptions";
import MapActionFactory from "./mapactionfactory";
import WikiActionFactory from "./wikiactionfactory";

class WorldActionFactory {

	static SET_CURRENT_WORLD = 'SET_CURRENT_WORLD';
	static SET_AVAILABLE_WORLDS = 'SET_AVAILABLE_WORLDS';

	static getAndSetCurrentWorld(worldId) {
		return async (dispatch, getState, {apiClient, history}) => {
			try{
				const world = await apiClient.getWorld(worldId).catch(err => {
					dispatch(UIActionFactory.gotoPage('/ui', {}, true));
				});
				if(world !== undefined){
					dispatch(WorldActionFactory.setCurrentWorld(world));
				}
			} catch(e){
				UIActionFactory.showError(e);
			}
		}
	}

	static setCurrentWorld(world) {
		return async (dispatch, getState, {apiClient, history}) => {
			dispatch({
				type: WorldActionFactory.SET_CURRENT_WORLD,
				currentWorld: world
			});
			if(world && world.wikiPage.mapImage){
				dispatch(MapActionFactory.getAndSetMap(world.wikiPage.mapImage._id));
			}
			dispatch(WikiActionFactory.getAllWikis());
			dispatch(MapActionFactory.getAndSetPins());
		};
	}

	static fetchAvailableWorlds(){
		return async (dispatch, getState, { apiClient, history}) => {
			try{
				let worldIds = await apiClient.fetchAvailableWorlds();
				const worlds = [];
				for(let worldId of worldIds){
					worlds.push(await apiClient.getWorld(worldId));
				}
				dispatch(WorldActionFactory.setAvailableWorlds(worlds));
			} catch (error){
				UIActionFactory.showError(error);
			}

		}
	}

	static setAvailableWorlds(worlds){
		return (dispatch, getState, { apiClient, history}) => {
			dispatch({
				type: WorldActionFactory.SET_AVAILABLE_WORLDS,
				availableWorlds: worlds
			});
		}
	}

	static createWorld(name, isPublic){
		return async (dispatch, getState, { apiClient, history}) => {
			try {
				let world = await apiClient.createWorld(name, isPublic);
				dispatch(this.fetchAvailableWorlds());
				dispatch(UIActionFactory.showCreateWorldModal(false));
				dispatch(WorldActionFactory.setCurrentWorld(world));
				const newUser = await apiClient.setCurrentWorld(world);
				dispatch({
					type: LoginActionFactory.SET_CURRENT_USER,
					user: newUser
				});
				dispatch(UIActionFactory.gotoPage('/ui/map', {world: world._id}))
			} catch (error) {
				UIActionFactory.showError(error);
			}
		};
	}

}

export default WorldActionFactory;