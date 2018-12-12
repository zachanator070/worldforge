import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";

import '../css/index.css';
import "antd/dist/antd.css";

import NavbarContainer from "./nav/navbarcontainer";
import {Router, Route, Switch, withRouter} from "react-router-dom";
import LoginActionFactory from "../redux/actions/loginactionfactory";
import ModalsContainer from "./modals/modalscontainer";
import DefaultViewContainer from './defaultviewcontainer';
import WikiContainer from "./wiki/wikicontainer";
import MapContainer from "./map/mapcontainer";
import GameContainer from "./game/gamecontainer";

class App extends Component {

	componentDidMount(){
		if(!this.props.currentUser){
			this.props.dispatchResumeSession();
		}
	}

	wrapHeader(content) {
		const header = [
			<ModalsContainer key={'modals'}/>,
			<NavbarContainer key={'nav'}/>
		];

		return (
			<div className='height-100 flex-column'>
				{header}
				{content}
			</div>
		);
	}

	render() {

		return (
				<Router history={this.props.history}>
					<Switch>
						<Route path="/ui/wiki" render={() => {return this.wrapHeader(<WikiContainer/>)}}/>
						<Route path="/ui/map" render={() => {return this.wrapHeader(<MapContainer/>)}}/>
						<Route path="/ui/game" render={() => {return this.wrapHeader(<GameContainer/>)}}/>
						<Route path="/" render={() => {return this.wrapHeader(<DefaultViewContainer/>)}}/>
					</Switch>
				</Router>
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
		}
	}
};

const AppContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(App);


export default AppContainer;
