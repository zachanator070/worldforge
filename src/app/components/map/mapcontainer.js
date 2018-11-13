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

class Map extends Component {

	constructor(props){
		super(props);
		this.state = {
			mapToUpload: null,
			width: 0,
			height: 0
		};
	}

	beforeUpload = (file) => {
		this.setState({
			mapToUpload: file
		});
		return false;
	};

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

	upload = () => {
		this.props.uploadImageFromMap(this.state.mapToUpload);
	};

	render(){
		if(!this.props.currentWorld){
			return (<DefaultViewContainer/>);
		}

		let canvas = <MapCanvas
			height={this.state.height}
			width={this.state.width}
			chunks={this.props.currentMap.chunks}
			setCurrentMapPosition={this.props.setCurrentMapPosition}
			setCurrentMapZoom={this.props.setCurrentMapZoom}
			currentMap={this.props.currentMap}
		/>;

		if(!this.props.currentMap.image){
			canvas = (
				<div className='padding-lg text-align-center'>
					<div className='padding-lg'>
						Map Image does not exist
					</div>
					<div className='padding-lg'>
						<Upload
							action="/api/images"
							beforeUpload={this.beforeUpload}
							multiple={false}
							showUploadList={true}
							fileList={this.state.mapToUpload ? [this.state.mapToUpload] : []}
							className='inline-block'
						>
							<Button>
								<Icon type="upload" /> Select Map
							</Button>
						</Upload>
					</div>
					{this.state.mapToUpload ? <Button onClick={this.upload}>
						Upload
					</Button> : null}
				</div>
			);
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
		ui: state.ui
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
		}
	}
};
 const MapContainer = connect(
	mapStateToProps,
	mapDispatchToProps
 )(withRouter(Map));

export default MapContainer;