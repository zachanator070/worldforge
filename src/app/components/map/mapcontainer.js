import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import DefaultViewContainer from "../defaultviewcontainer";
import {Button, Divider, Drawer, Icon, Popover, Row, Upload} from "antd";
import WikiActionFactory from "../../redux/actions/wikiactionfactory";
import MapCanvas from "./mapcanvas";
import MapActionFactory from "../../redux/actions/mapactionfactory";
import WikiView from "../wiki/wikiview";
import UIActionFactory from "../../redux/actions/uiactionfactory";
import DefaultMapView from "./defaultmapview";
import SlidingDrawer from "../slidingdrawer";
import MapBreadCrumbs from "./mapbreadcrumbs";

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
		if(this.refs.container){
			this.setState({ width: this.refs.container.offsetWidth, height: this.refs.container.offsetHeight});
		}
		else {
			this.setState({ width: window.innerWidth, height: window.innerHeight});
		}
	};

	getPins = () => {
		let pins =  [];
		for (let pin of this.props.allPins.filter((pin) => {return pin.map._id === this.props.currentMap.image._id})){

			const editButton = this.props.currentWorld && this.props.currentWorld.canWrite ?
				<a href='#' className='margin-md-left' onClick={() => {
					this.props.setPinBeingEdited(pin);
					this.props.showEditPinModal(true);
				}}>Edit Pin</a>
				: null;

			let pinPopupContent = <div>
				<h2>Empty Pin</h2>
				{editButton}
			</div>;

			if(pin.page){
				pinPopupContent = <div>
					<h2>{pin.page.name}</h2>
					<h3>{pin.page.type}</h3>
					<a href='#' onClick={() => {
						this.props.findAndSetDisplayWiki(pin.page._id);
						this.props.showLeftDrawer(true);
					}}>Details</a>
					{pin.page.type === 'place' && pin.page.mapImage ? <a className='margin-md-left' href='#' onClick={() => {this.props.gotoPage('/ui/map', {map: pin.page.mapImage._id})}}>Open Map</a> : null }
					{editButton}
				</div>;
			}

			pins.push({
				x: pin.x,
				y: pin.y,
				render: (x, y) => {
					return (
						<Popover
							content={pinPopupContent}
							trigger="click"
							key={pin._id}
							overlayStyle={{zIndex: '3'}}
						>
							<Icon
								type="pushpin"
								style={{position: 'absolute', left: x, top: y - 50, fontSize: '50px', zIndex: 1, color:'red'}}
								theme='filled'
								draggable="false"
							/>
						</Popover>
					);
				}
			});
		}

		return pins;
	};

	render(){
		if(!this.props.currentWorld){
			return (<DefaultViewContainer/>);
		}
		const pins = this.getPins();

		let canvas = <MapCanvas
			setCurrentMapPosition={this.props.setCurrentMapPosition}
			setCurrentMapZoom={this.props.setCurrentMapZoom}
			currentMap={this.props.currentMap}
			currentWorld={this.props.currentWorld}
			menuItems={[
				{
					onClick: (mouseX, mouseY) => {
						let pin = {
							x: mouseX,
							y: mouseY,
							map: this.props.currentMap.image._id
						};
						this.props.createPin(pin);
					},
					name: 'New Pin'
				}
			]}
			extras={pins}
		/>;

		if(!this.props.currentMap.image){
			canvas = <DefaultMapView
				uploadImageFromMap={this.props.uploadImageFromMap}
				ui={this.props.ui}
				setMapUploadStatus={this.props.setMapUploadStatus}
			/>;
		}

		return (
			<div id='mapContainer' style={{position: 'relative'}} className='overflow-hidden flex-column flex-grow-1' ref='container'>
				<MapBreadCrumbs
					gotoPage={this.props.gotoPage}
					currentWorld={this.props.currentWorld}
					currentMap={this.props.currentMap}
					allWikis={this.props.allWikis}
					allPins={this.props.allPins}
				/>
				<div className='flex-grow-1 flex-column'>
					{this.props.displayWiki ?
						<SlidingDrawer
							side='left'
							show={this.props.ui.showLeftDrawer}
							setShow={this.props.showLeftDrawer}
							height={this.state.height}
							maxWidth={this.state.width}
						>
							<WikiView
								gotoPage={this.props.gotoPage}
								currentWiki={this.props.displayWiki}
								currentWorld={this.props.currentWorld}
							/>
						</SlidingDrawer>
						: null}
					{canvas}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		currentUser: state.currentUser,
		currentWorld: state.currentWorld,
		currentMap: state.currentMap,
		allPins: state.allPins,
		allWikis: state.allWikis,
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
		showLeftDrawer: (show) => {
			dispatch(UIActionFactory.showLeftDrawer(show));
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