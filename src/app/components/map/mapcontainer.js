import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import DefaultViewContainer from "../defaultviewcontainer";
import {Button, Divider, Drawer, Icon, Row, Upload} from "antd";
import WikiActionFactory from "../../redux/actions/wikiactionfactory";
import MapCanvas from "./mapcanvas";
import MapActionFactory from "../../redux/actions/mapactionfactory";
import WikiView from "../wiki/wikiview";
import UIActionFactory from "../../redux/actions/uiactionfactory";
import DefaultMapView from "./defaultmapview";

class Map extends Component {

	constructor(props){
		super(props);
		this.state = {
			width: 0,
			height: 0
		};
	}

	componentDidMount(){
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions = () => {
		this.setState({ width: window.innerWidth, height: window.innerHeight - 42});
	};



	render(){
		if(!this.props.currentWorld){
			return (<DefaultViewContainer/>);
		}

		let canvas = <MapCanvas
			height={this.state.height}
			width={this.state.width}
			setCurrentMapPosition={this.props.setCurrentMapPosition}
			setCurrentMapZoom={this.props.setCurrentMapZoom}
			currentMap={this.props.currentMap}
			createPin={this.props.createPin}
			currentWorld={this.props.currentWorld}
			findAndSetDisplayWiki={this.props.findAndSetDisplayWiki}
			showDrawer={this.props.showDrawer}
			showEditPinModal={this.props.showEditPinModal}
			setPinBeingEdited={this.props.setPinBeingEdited}
		/>;

		if(!this.props.currentMap.image){
			canvas = <DefaultMapView
				uploadImageFromMap={this.props.uploadImageFromMap}
				ui={this.props.ui}
				setMapUploadStatus={this.props.setMapUploadStatus}
			/>;
		}

		return (
			<div id='mapContainer' style={{position: 'relative'}} className='overflow-hidden'>
				{this.props.displayWiki ?
					<div style={{height: this.state.height}} className='drawer'>
						<div className={this.props.ui.showDrawer ? 'show-drawer drawer-content' : 'hide-drawer drawer-content'}>
							<WikiView
								gotoPage={this.props.gotoPage}
								currentWiki={this.props.displayWiki}
								currentWorld={this.props.currentWorld}
							/>
						</div>
						<div className='hide-button'>
							<a href='#' onClick={() => {this.props.showDrawer(!this.props.ui.showDrawer)}}>
								{this.props.ui.showDrawer ? <Icon type="double-left" /> : <Icon type="double-right" /> }
							</a>
						</div>
					</div>
					: null}
				{canvas}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		currentUser: state.currentUser,
		currentWorld: state.currentWorld,
		currentMap: state.currentMap,
		displayWiki: state.displayWiki,
		ui: state.ui,
	}
};

const mapDispatchToProps = dispatch => {
	return {
		uploadImageFromMap : (file) => {
			dispatch(WikiActionFactory.uploadImageFromMap(file));
		},
		setCurrentMapPosition: (x, y) => {
			dispatch(MapActionFactory.setCurrentMapPosition(x, y));
		},
		showDrawer: (show) => {
			dispatch(UIActionFactory.showDrawer(show));
		},
		gotoPage: (path, params = null, override=false) => {
			dispatch(UIActionFactory.gotoPage(path, params, override));
		},
		setCurrentMapZoom: (zoom) => {
			dispatch(MapActionFactory.setCurrentMapZoom(zoom));
		},
		createPin: (pin) => {
			dispatch(MapActionFactory.createPin(pin));
		},
		findAndSetDisplayWiki: (wikiId) => {
			dispatch(WikiActionFactory.findAndSetDisplayWiki(wikiId));
		},
		showEditPinModal: (show) => {
			dispatch(UIActionFactory.showEditPinModal(show));
		},
		setPinBeingEdited: (pin) => {
			dispatch(MapActionFactory.setPinBeingEdited(pin));
		},
		setMapUploadStatus: (status) => {
			dispatch(UIActionFactory.setMapUploadStatus(status));
		}
	}
};
 const MapContainer = connect(
	mapStateToProps,
	mapDispatchToProps
 )(withRouter(Map));

export default MapContainer;