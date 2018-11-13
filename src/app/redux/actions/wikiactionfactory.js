import WorldActionFactory from "./worldactionfactory";
import UIActionFactory from "./uiactionfactory";


class WikiActionFactory{
	static SET_CURRENT_WIKI = 'SET_CURRENT_WIKI';
	static SAVE_CURRENT_WIKI_ERROR = 'SAVE_CURRENT_WIKI_ERROR';
	static CREATE_WIKI_ERROR = 'CREATE_WIKI_ERROR';
	static SET_WIKI_SEARCH_RESULTS = 'SET_WIKI_SEARCH_RESULTS';
	static SET_DISPLAY_WIKI = 'SET_DISPLAY_WIKI';

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
			dispatch(UIActionFactory.gotoPage('/ui/map', {map: newWorld.wikiPage.mapImage._id}))
		}
	}

	static createWiki(name, type, folder){
		return async (dispatch, getState, {apiClient, history}) => {
			const newWiki = await apiClient.createWikiPage(name, getState().currentWorld._id, type);
			folder.pages.push(newWiki);
			await apiClient.updateFolder(folder);
			const world = await apiClient.getWorld(getState().currentWorld._id);
			dispatch({
				type: WorldActionFactory.SET_CURRENT_WORLD,
				currentWorld: world
			});
			dispatch(UIActionFactory.gotoPage('/ui/wiki/view', {wiki: newWiki._id}));
		}
	}

	static saveWiki(name, type, coverToUpload, mapToUpload, content){
		return async (dispatch, getState, {apiClient, history}) => {
			const toUpdate = Object.assign({}, getState().currentWiki);
				toUpdate.name = name;
				toUpdate.type = type;
				toUpdate.content = content;
			if (coverToUpload){
				const coverResponse = await apiClient.postImage(coverToUpload, false);
				toUpdate.coverImage = coverResponse._id;
			}
			if(coverToUpload === null) {
				toUpdate.coverImage = null;
			}
			if (mapToUpload){
				const mapResponse = await apiClient.postImage(mapToUpload);
				toUpdate.mapImage = mapResponse._id;
			}
			if(mapToUpload === null) {
				toUpdate.mapImage = null;
			}
			const updatedWiki = await apiClient.updateWiki(toUpdate);
			if(name !== getState().currentWiki.name){
				await dispatch(WorldActionFactory.getAndSetCurrentWorld(getState().currentWorld._id));
			}
			dispatch(WikiActionFactory.setCurrentWiki(updatedWiki));
			if(name === getState().currentWorld.name){
				await dispatch(WorldActionFactory.getAndSetCurrentWorld(getState().currentWorld._id));
			}
			if(updatedWiki.mapImage && updatedWiki.mapImage._id === getState().currentMap._id){
				await dispatch(WorldActionFactory.getAndSetMap(getState().currentMap._id));
			}
			dispatch(UIActionFactory.gotoPage('/ui/wiki/view'));
		}
	}

	static updateFolder(folder){
		return async (dispatch, getState, {apiClient, history}) => {
			await apiClient.updateFolder(folder);
			const world = await apiClient.getWorld(getState().currentWorld._id);
			dispatch({
				type: WorldActionFactory.SET_CURRENT_WORLD,
				currentWorld: world
			});
		}
	}

	static createFolder(parent, folder){
		return async (dispatch, getState, {apiClient, history}) => {
			const createdFolder = await apiClient.createFolder(folder);
			parent.children.push(createdFolder._id);
			await apiClient.updateFolder(parent);
			const world = await apiClient.getWorld(getState().currentWorld._id);
			dispatch({
				type: WorldActionFactory.SET_CURRENT_WORLD,
				currentWorld: world
			});
		}
	}

	static deleteFolder(folder){
		return async (dispatch, getState, {apiClient, history}) => {
			await apiClient.deleteFolder(folder);
			const world = await apiClient.getWorld(getState().currentWorld._id);
			dispatch({
				type: WorldActionFactory.SET_CURRENT_WORLD,
				currentWorld: world
			});
		}
	}

	static searchWikis(params){
		return async (dispatch, getState, {apiClient, history}) => {
			const results = await apiClient.searchWikis(params);
			dispatch({
				type: WikiActionFactory.SET_WIKI_SEARCH_RESULTS,
				results: results
			});
		}
	}

	static findAndSetDisplayWiki(wikiId){
		return async (dispatch, getState, {apiClient, history}) => {
			const wiki = await apiClient.getWiki(wikiId);
			dispatch({
				type: WikiActionFactory.SET_DISPLAY_WIKI,
				wiki: wiki
			});
		}
	}

}

export default WikiActionFactory;