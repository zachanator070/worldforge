import UIActionFactory from "./uiactionfactory";
import LoginActionFactory from "./loginactionfactory";
import ApiClient from "../../apiclient";
import ApiError from "../../exceptions";
import MapActionFactory from "./mapactionfactory";
import WikiActionFactory from "./wikiactionfactory";

class WorldActionFactory {

	static SET_CURRENT_WORLD = 'SET_CURRENT_WORLD';
	static SET_AVAILABLE_WORLDS = 'SET_AVAILABLE_WORLDS';
	static AVAILABLE_WORLDS_ERROR = 'AVAILABLE_WORLDS_ERROR';
	static CREATE_WORLDS_ERROR = 'CREATE_WORLDS_ERROR';
	static SET_DISPLAY_WORLD = 'SET_DISPLAY_WORLD';

	static getAndSetCurrentWorld(worldId) {
		return async (dispatch, getState, {apiClient, history}) => {
			const world = await apiClient.getWorld(worldId).catch(err => {
				dispatch(UIActionFactory.gotoPage('/ui', {}, true));
			});
			if(world !== undefined){
				dispatch(WorldActionFactory.setCurrentWorld(world));
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
				dispatch(WorldActionFactory.fetchWorldsError(error.message))
			}

		}
	}

	static fetchWorldsError(error){
		return {
			type: WorldActionFactory.AVAILABLE_WORLDS_ERROR,
			error: error
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
				dispatch(this.createWorldError(error.message || error.error))
			}
		};
	}

	static createWorldError(error){
		return {
			type: WorldActionFactory.CREATE_WORLDS_ERROR,
			error: error
		}
	}

	static displayWorld(world){
		return async (dispatch, getState, { apiClient, history}) => {
			dispatch({
				type: WorldActionFactory.SET_DISPLAY_WORLD,
				displayWorld: world
			});
		};
	}
}

export default WorldActionFactory;