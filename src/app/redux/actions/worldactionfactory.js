import UIActionFactory from "./uiactionfactory";
import LoginActionFactory from "./loginactionfactory";
import ApiClient from "../../apiclient";
import ApiError from "../../exceptions";
import MapActionFactory from "./mapactionfactory";

class WorldActionFactory {

	static SET_CURRENT_WORLD = 'SET_CURRENT_WORLD';
	static SET_AVAILABLE_WORLDS = 'SET_AVAILABLE_WORLDS';
	static AVAILABLE_WORLDS_ERROR = 'AVAILABLE_WORLDS_ERROR';
	static CREATE_WORLDS_ERROR = 'CREATE_WORLDS_ERROR';
	static SET_DISPLAY_WORLD = 'SET_DISPLAY_WORLD';

	static findAndSetCurrentWorld(worldId){
		return async (dispatch, getState, { apiClient, history}) => {
			let world = null;
			if(worldId !== null){
				world = await apiClient.getWorld(worldId).catch((error) => {
					dispatch(UIActionFactory.gotoPage('/ui', {}));
					return null;
				});
			}

			dispatch(WorldActionFactory.setCurrentWorld(world));

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
			dispatch(UIActionFactory.redirectAfterWorldChange());
		};
	}

	static fetchAvailableWorlds(){
		return async (dispatch, getState, { apiClient, history}) => {
			try{
				let worlds = await apiClient.fetchAvailableWorlds();
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
			try{
				let world = await apiClient.createWorld(name, isPublic);
				const wikiPage = await apiClient.createWikiPage(name, world._id, ApiClient.WIKI_PLACE);
				world.wikiPage = wikiPage._id;
				await apiClient.updateWorld(world);
				dispatch(this.fetchAvailableWorlds());
				dispatch(UIActionFactory.showCreateWorldModal(false))
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