import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";

import '../css/index.css';
import "antd/dist/antd.css";

import NavbarContainer from "./nav/navbarcontainer";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import MapView from "./mapcontainer";
import LoginActionFactory from "../redux/actions/loginactionfactory";

class App extends Component {

	componentDidMount(){
		if(!this.props.loggedIn.user){
			this.props.dispatchResumeSession();
		}
	}

	render() {

		// let mapContainer = <MapView
		// 	loggedIn={this.props.loggedIn}
		// 	world={this.props.currentWorld}
		// 	dispatchWorldSelected={this.props.dispatchWorldSelected}
		// />;
		return (
			<div>
				<NavbarContainer/>
				{/*<div>*/}
					{/*<BrowserRouter>*/}
						{/*<Switch>*/}
							{/*/!*<Route path="/ui/worldmanager" render={(props) => {return (<WorldManager loggedIn={this.props.loggedIn} currentSelectedWorld={this.props.currentSelectedWorld}/>);}}/>*!/*/}
							{/*/!*<Route path="/ui/imagemanager" component={ImageManager}/>*!/*/}
							{/*/!*<Route path="/ui/wiki" component={Wiki}/>*!/*/}
							{/*<Route path="/ui/map/:mapId" render={(props) => {return mapContainer;}}/>*/}
							{/*<Route path="/" render={(props) => {return mapContainer;}}/>*/}
						{/*</Switch>*/}
					{/*</BrowserRouter>*/}
				{/*</div>*/}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		loggedIn: state.loggedIn,
	}
};

const mapDispatchToProps = dispatch => {
	return {
		dispatchResumeSession: () => {
			dispatch(LoginActionFactory.resumeSession())
		}
	}
};

const AppContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(App);


export default AppContainer;
