import UIActionFactory from "./uiactionfactory";
import LoginActionFactory from "./loginactionfactory";
import ApiClient from "../../apiclient";

class WorldActionFactory {

	static SELECT_WORLD = 'SELECT_WORLD';
	static AVAILABLE_WORLDS_SUCCESS = 'AVAILABLE_WORLDS_SUCCESS';
	static AVAILABLE_WORLDS_ERROR = 'AVAILABLE_WORLDS_ERROR';
	static CREATE_WORLDS_ERROR = 'CREATE_WORLDS_ERROR';
	static SET_DISPLAY_WORLD = 'SET_DISPLAY_WORLD';

	static selectWorld(world){
		return async (dispatch, getState, api) => {
			dispatch(
				{
					type: WorldActionFactory.SELECT_WORLD,
					currentWorld: world
				}
			);
			if(getState().currentUser && world && getState().currentUser.currentWorld !== world._id){
				const newUser = await api.setCurrentWorld(world);
				dispatch(LoginActionFactory.createLoginSuccessAction(newUser));
			}
			dispatch(UIActionFactory.showSelectWorldModal(false));
		}
	}

	static fetchAvailableWorlds(){
		return async (dispatch, getState, api) => {
			try{
				let worlds = await api.fetchAvailableWorlds();
				dispatch(WorldActionFactory.fetchWorldsSuccess(worlds));
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

	static fetchWorldsSuccess(worlds){
		return (dispatch, getState, api) => {
			dispatch({
				type: WorldActionFactory.AVAILABLE_WORLDS_SUCCESS,
				availableWorlds: worlds
			});
			let canViewCurrentWorld = false;
			for (let world of getState().availableWorlds){
				if(world._id === getState().currentWorld._id && world.owner._id === getState().currentWorld.owner._id){
					canViewCurrentWorld = true;
				}
			}
			if(!canViewCurrentWorld){
				dispatch(WorldActionFactory.selectWorld(null));
			}
		}
	}

	static createWorld(name, isPublic){
		return async (dispatch, getState, api) => {
			try{
				const world = await api.createWorld(name, isPublic);
				const wikiPage = await api.createWikiPage(name, world._id, ApiClient.WIKI_PLACE);

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
		return async (dispatch, getState, api) => {
			dispatch({
				type: WorldActionFactory.SET_DISPLAY_WORLD,
				displayWorld: world
			});
		};
	}
}

export default WorldActionFactory;