import React, { Component } from 'react';
import {withRouter} from "react-router-dom";

class MapContainer extends Component {
	render(){
		if(this.props.currentSelectedWorld){
			return (<div>Start rendering map</div>);
		}
		return (<div>No world selected go to <a href='#' onClick={() => {this.props.history.push('/ui/worldmanager')}}>World Manaager</a> and select one</div>);
	}
}

export default withRouter(MapContainer);