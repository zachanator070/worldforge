import UIActionFactory from "./uiactionfactory";

class MapActionFactory {
	static SET_CURRENT_MAP = 'SET_CURRENT_MAP';
	static SET_CURRENT_MAP_POSITION = 'SET_CURRENT_MAP_POSITION';
	static SET_CURRENT_MAP_ZOOM = 'SET_CURRENT_MAP_ZOOM';
	static SET_PINS = 'SET_PINS';
	static SET_PIN_BEING_EDITED = 'SET_PIN_BEING_EDITED';

	static getAndSetMap(mapId){
		return async (dispatch, getState, {apiClient, history}) => {
			try{
				const mapImage = await apiClient.getImage(mapId);
				dispatch(MapActionFactory.setMap(mapImage));
			} catch (e){
				UIActionFactory.showError(e)
			}
		};
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

	static getAndSetPins(){
		return async (dispatch, getState, {apiClient, history}) => {
			try{
				const pins = await apiClient.getPins(getState().currentWorld._id);
				dispatch(MapActionFactory.setPins(pins));
			} catch(e){
				UIActionFactory.showError(e);
			}

		}
	}

	static setPins(pins){
		return {
			type: MapActionFactory.SET_PINS,
			pins: pins
		}
	}

	static updatePin(pin){
		return async (dispatch, getState, {apiClient, history}) => {
			try{
				await apiClient.updatePin(pin);
				dispatch(MapActionFactory.getAndSetPins());
			} catch(e){
				UIActionFactory.showError(e);
			}

		}
	}

	static createPin(pin){
		return async (dispatch, getState, {apiClient, history}) => {
			try{
				await apiClient.createPin(pin);
				dispatch(MapActionFactory.getAndSetPins());
			} catch(e){
				UIActionFactory.showError(e);
			}

		}
	}

	static deletePin(pin){
		return async (dispatch, getState, {apiClient, history}) => {
			try {
				await apiClient.deletePin(pin);
				dispatch(MapActionFactory.getAndSetPins());
			} catch(e){
				UIActionFactory.showError(e);
			}
		}
	}

	static setPinBeingEdited(pin){
		return {
			type: MapActionFactory.SET_PIN_BEING_EDITED,
			pin: pin
		}
	}

}

export default MapActionFactory;