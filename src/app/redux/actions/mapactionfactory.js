
class MapActionFactory {
	static SET_CURRENT_MAP = 'SET_CURRENT_MAP';
	static ADD_CHUNK = 'ADD_CHUNK';
	static SET_CURRENT_MAP_CHUNKS = 'SET_CURRENT_MAP_CHUNKS';
	static SET_CURRENT_MAP_POSITION = 'SET_CURRENT_MAP_POSITION';
	static SET_CURRENT_MAP_ZOOM = 'SET_CURRENT_MAP_ZOOM';

	static getAndSetMap(mapId){
		return async (dispatch, getState, {apiClient, history}) => {
			const mapImage = await apiClient.getImage(mapId);
			dispatch(MapActionFactory.setMap(mapImage));
			const chunks = await apiClient.getChunks(mapImage._id);
			dispatch(MapActionFactory.setCurrentMapChunks(chunks));
		};
	}

	static loadCurrentWorldDefaultMap(){
		return async (dispatch, getState, {apiClient, history}) => {
			if(getState().currentWorld.wikiPage.mapImage){
				const map = await apiClient.getImage(getState().currentWorld.wikiPage.mapImage);
				dispatch({
					type: MapActionFactory.SET_CURRENT_MAP,
					map: map
				})
			}
		}
	}

	static setCurrentMapChunks(chunks){
		return {
			type: MapActionFactory.SET_CURRENT_MAP_CHUNKS,
			chunks: chunks
		}
	}

	static addChunk(chunk){
		return {
			type: MapActionFactory.ADD_CHUNK,
			chunk: chunk
		}
	}

	static setMap(map){
		return {
			type: MapActionFactory.SET_CURRENT_MAP,
			map: map
		}
	}
	static setCurrentMapPosition(x, y){
		return {
			type: MapActionFactory.SET_CURRENT_MAP_POSITION,
			x: x,
			y: y
		}
	}

	static setCurrentMapZoom(zoom){
		return{
			type: MapActionFactory.SET_CURRENT_MAP_ZOOM,
			zoom: zoom
		}
	}
}

export default MapActionFactory;