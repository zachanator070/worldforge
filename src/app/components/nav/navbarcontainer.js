import { Component } from 'react';
import React from "react";
import RegisterModal from "../modals/registermodal";
import {Button, Col, Row} from "antd";
import LoginModal from "../modals/loginmodal";
import WorldMenu from "./worldmenu";
import connect from "react-redux/es/connect/connect";
import LoginActionFactory from "../../redux/actions/loginactionfactory";
import RegisterActionFactory from "../../redux/actions/registeractionfactory";
import UIActionFactory from "../../redux/actions/uiactionfactory";
import WorldActionFactory from "../../redux/actions/worldactionfactory";

class NavBar extends Component {

	constructor(props){
		super(props);
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
						<Button type='primary' className='margin-sm' onClick={() => {this.props.showLogin(true)}} >Login</Button>
						<div className='margin-sm'>
							Don't have an account yet? <a href='#' onClick={() => {this.props.showRegister(true)}} className='margin-sm'>Register</a>
						</div>
					</div>
				</div>
			);
		}


		return (
			<div className='shadow-sm padding-sm'>
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
	}
};

const NavbarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NavBar);


export default NavbarContainer;