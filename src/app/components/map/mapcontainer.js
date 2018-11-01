import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import DefaultViewContainer from "../defaultviewcontainer";
import {Button, Icon, Row, Upload} from "antd";
import WikiActionFactory from "../../redux/actions/wikiactionfactory";
import MapCanvas from "./mapcanvas";
import MapActionFactory from "../../redux/actions/mapactionfactory";

class Map extends Component {

	constructor(props){
		super(props);
		this.state = {
			mapToUpload: null
		};
	}

	beforeUpload = (file) => {
		this.setState({
			mapToUpload: file
		});
		return false;
	};

	upload = () => {
		this.props.uploadImageFromMap(this.state.mapToUpload);
	};

	render(){
		if(!this.props.currentWorld){
			return (<DefaultViewContainer/>);
		}
		if(!this.props.currentMap.image){
			return (
				<div>
					<div>
						Map Image does not exist
					</div>
					<Upload
						action="/api/images"
						beforeUpload={this.beforeUpload}
						multiple={false}
						showUploadList={true}
						fileList={this.state.mapToUpload ? [this.state.mapToUpload] : []}
					>
						<Button>
							<Icon type="upload" /> Select Map
						</Button>
					</Upload>
					<Button onClick={this.upload}>
						Upload
					</Button>
				</div>
			);
		}

		return (
			<MapCanvas
				chunks={this.props.currentMap.chunks}
				width={this.state.windowWidth}
				height={this.state.windowHeight - 47}
				setCurrentMapPosition={this.props.setCurrentMapPosition}
				currentMap={this.props.currentMap}
			/>
		);
	}
}

const mapStateToProps = state => {
	return {
		currentUser: state.currentUser,
		currentWorld: state.currentWorld,
		currentMap: state.currentMap
	}
};

const mapDispatchToProps = dispatch => {
	return {
		uploadImageFromMap : (file) => {
			dispatch(WikiActionFactory.uploadImageFromMap(file));
		},
		setCurrentMapPosition: (x, y) => {
			dispatch(MapActionFactory.setCurrentMapPosition(x, y));
		}
	}
};
 const MapContainer = connect(
	mapStateToProps,
	mapDispatchToProps
 )(withRouter(Map));

export default MapContainer;