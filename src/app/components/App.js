import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";

import '../css/index.css';
import "antd/dist/antd.css";

import NavbarContainer from "./nav/navbarcontainer";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import MapView from "./map/mapcontainer";
import LoginActionFactory from "../redux/actions/loginactionfactory";
import ModalsContainer from "./modals/modalscontainer";
import WorldActionFactory from "../redux/actions/worldactionfactory";

class App extends Component {

	componentDidMount(){
		if(!this.props.currentUser){
			this.props.dispatchResumeSession();
		}
		this.props.fetchAvailableWorlds();
	}

	render() {

		return (
			<div>
				<ModalsContainer/>
				<NavbarContainer/>
				<div>
					<BrowserRouter>
						<Switch>
							{/*<Route path="/ui/worldmanager" render={(props) => {return (<WorldManager loggedIn={this.props.loggedIn} currentSelectedWorld={this.props.currentSelectedWorld}/>);}}/>*/}
							{/*<Route path="/ui/imagemanager" component={ImageManager}/>*/}
							{/*<Route path="/ui/wiki" component={Wiki}/>*/}
							<Route path="/ui/map/:mapId" component={MapView}/>
							<Route path="/" component={MapView}/>
						</Switch>
					</BrowserRouter>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		currentUser: state.currentUser,
	}
};

const mapDispatchToProps = dispatch => {
	return {
		dispatchResumeSession: () => {
			dispatch(LoginActionFactory.resumeSession())
		},
		fetchAvailableWorlds: () => {
			dispatch(WorldActionFactory.fetchAvailableWorlds());
		}
	}
};

const AppContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(App);


export default AppContainer;
