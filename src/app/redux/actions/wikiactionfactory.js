import WorldActionFactory from "./worldactionfactory";
import UIActionFactory from "./uiactionfactory";


class WikiActionFactory{
	static SET_CURRENT_WIKI = 'SET_CURRENT_WIKI';
	static SAVE_CURRENT_WIKI_ERROR = 'SAVE_CURRENT_WIKI_ERROR';
	static CREATE_WIKI_ERROR = 'CREATE_WIKI_ERROR';

	static getAndSetWiki(wikiId){
		return async (dispatch, getState, {apiClient, history}) => {
			const wiki = await apiClient.getWiki(wikiId);
			dispatch(WikiActionFactory.setCurrentWiki(wiki));
		}
	}

	static setCurrentWiki(wiki){
		return {
			type: WikiActionFactory.SET_CURRENT_WIKI,
			wiki: wiki
		}
	}

	static uploadImageFromMap(file){
		return async (dispatch, getState, {apiClient, history}) => {
			const imageResponse = await apiClient.postImage(file);
			const currentWorld = getState().currentWorld;
			const worldWiki = getState().currentWorld.wikiPage;
			worldWiki.mapImage = imageResponse._id;
			const wikiResponse = await apiClient.updateWiki(worldWiki);
			const newWorld = await apiClient.getWorld(getState().currentWorld._id);
			dispatch(WorldActionFactory.setCurrentWorld(newWorld));
			dispatch(UIActionFactory.gotoPage('/ui/map', {world: newWorld._id, map: newWorld.wikiPage.mapImage._id}))
		}
	}
}

export default WikiActionFactory;