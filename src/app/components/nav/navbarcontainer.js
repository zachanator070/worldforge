import { Component } from 'react';
import React from "react";
import {Button, Col, Divider, Row} from "antd";
import WorldMenu from "./worldmenu";
import connect from "react-redux/es/connect/connect";
import LoginActionFactory from "../../redux/actions/loginactionfactory";
import UIActionFactory from "../../redux/actions/uiactionfactory";
import {Link, withRouter} from "react-router-dom";

class NavBar extends Component {

	constructor(props){
		super(props);
	}

	componentDidMount(){
	}

	render() {
		let loginOptions = <div>Loading...</div>;

		if(this.props.currentUser){
			loginOptions = (
				<span>
				<Button type='primary' onClick={this.props.dispatchTryLogout}>Logout</Button>
			</span>
			);
		} else {
			loginOptions = (
				<div>
					<div className='text-align-right'>
						<a href='#' className='margin-sm' onClick={() => {this.props.showLogin(true)}} >Login</a> or
						<a href='#' onClick={() => {this.props.showRegister(true)}} className='margin-sm'>Register</a>
					</div>
				</div>
			);
		}


		return (
			<div className='shadow-sm padding-sm nav-bar'>
				<Row>
					<Col span={4}>
						<WorldMenu
							currentUser={this.props.currentUser}
							currentWorld={this.props.currentWorld}
							showCreateWorldModal={this.props.showCreateWorldModal}
							showSelectWorldModal={this.props.showSelectWorldModal}
						/>
					</Col>
					<Col span={16}>
						<Divider type='vertical'/>
						<Link to={{
							pathname: "/ui/map",
							search: this.props.history.location.search,
						}}>Map</Link>
						<Divider type='vertical'/>
						<Link to={{
							pathname: "/ui/wiki",
							search: this.props.history.location.search,
						}}>Wiki</Link>
					</Col>
					<Col span={4}>
						{loginOptions}
					</Col>
				</Row>
			</div>
		);
	}

}

const mapStateToProps = state => {
	return {
		currentUser: state.currentUser,
		currentWorld: state.currentWorld
	}
};

const mapDispatchToProps = dispatch => {
	return {
		dispatchTryLogout: () => {
			dispatch(LoginActionFactory.tryLogout());
		},
		showLogin: (show) => {
			dispatch(UIActionFactory.showLoginModal(show));
		},
		showRegister: (show) => {
			dispatch(UIActionFactory.showRegistrationModal(show));
		},
		showCreateWorldModal: (show) => {
			dispatch(UIActionFactory.showCreateWorldModal(show));
		},
		showSelectWorldModal: (show) => {
			dispatch(UIActionFactory.showSelectWorldModal(show));
		},
		gotoPage: (path, params = null) => {
			dispatch(UIActionFactory.gotoPage(path, params));
		}
	}
};

const NavbarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(NavBar));


export default NavbarContainer;