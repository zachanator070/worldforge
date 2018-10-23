import { Component } from 'react';
import React from "react";
import RegisterModal from "./registermodal";
import {Button, Col, Row} from "antd";
import LoginModal from "./loginmodal";
import WorldMenu from "./worldmenu";
import connect from "react-redux/es/connect/connect";
import LoginActionFactory from "../../redux/actions/loginactionfactory";

class NavBar extends Component {

	constructor(props){
		super(props);
		this.state = {
			showLogin: false,
			showLogout: false,
			showRegister: false
		}
	}

	render() {
		let loginOptions = <div>Loading...</div>;
		if(!this.props.loggedIn.isFetching){
			if(this.props.loggedIn.user){
				loginOptions = (
					<span>
					<Button type='primary' onClick={this.props.dispatchTryLogout}>Logout</Button>
				</span>
				);
			} else {
				loginOptions = (
					<div>
						<div className='text-align-right'>
							<Button type='primary' className='margin-sm' onClick={() => {this.setState({showLogin: true})}} type='primary'>Login</Button>
							<LoginModal
								show={this.state.showLogin || this.props.loggedIn.isFetching || this.props.loggedIn.error !== null}
								error={this.props.loggedIn.error}
								cancel={() => {this.props.dispatchClearLoginError(); this.setState({showLogin: false});}}
								login={(username, password) => {
									this.props.dispatchTryLogin(username, password);
									this.setState({showLogin: false});
								}}
							/>
							<div className='margin-sm'>
								Don't have an account yet? <a href='#' onClick={() => {this.setState({showRegister: true})}} className='margin-sm'>Register</a>
							</div>
							<RegisterModal
								show={this.state.showRegister}
								callback={(user) => {
									this.setState({showRegister: false});
									this.props.dispatchLogin(user)
								}}
							/>
						</div>
					</div>
				);
			}
		}

		return (
			<div className='shadow-sm padding-sm'>
				<Row>
					<Col span={4}>
						{/*<WorldMenu dispathcWorldSelected={this.props.dispatchWorldSelected}/>*/}
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
		loggedIn: state.loggedIn,
	}
};

const mapDispatchToProps = dispatch => {
	return {
		dispatchTryLogin: (username, password) => {
			dispatch(LoginActionFactory.tryLogin(username, password))
		},
		dispatchTryLogout: () => {
			dispatch(LoginActionFactory.tryLogout())
		},
		dispatchClearLoginError: () => {
			dispatch(LoginActionFactory.createClearLoginError())
		}
	}
};

const NavbarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NavBar);


export default NavbarContainer;