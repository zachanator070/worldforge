import { Component } from 'react';
import React from "react";
import {Button, Col, Divider, Row} from "antd";
import WorldMenu from "./worldmenu";
import connect from "react-redux/es/connect/connect";
import LoginActionFactory from "../../redux/actions/loginactionfactory";
import UIActionFactory from "../../redux/actions/uiactionfactory";
import {Link, withRouter} from "react-router-dom";
import SearchBar from "./searchbar";
import WikiActionFactory from "../../redux/actions/wikiactionfactory";

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
				<span style={{position: 'absolute', right: '0px'}}>
					<span className='margin-md-right'>Hello {this.props.currentUser.displayName}</span>
					<span>
						<Button type='primary' onClick={this.props.dispatchTryLogout}>Logout</Button>
					</span>
				</span>
			);
		} else {
			loginOptions = (
				<div>
					<div className='text-align-right margin-sm-top '>
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
						<div className='margin-md-left margin-sm-top'>
							<WorldMenu
								currentUser={this.props.currentUser}
								currentWorld={this.props.currentWorld}
								showCreateWorldModal={this.props.showCreateWorldModal}
								showSelectWorldModal={this.props.showSelectWorldModal}
							/>
						</div>
					</Col>
					<Col span={4}>
						<div className='margin-sm-top'>
							<Divider type='vertical'/>
							<a href='#' onClick={() => {this.props.gotoPage('/ui/map')}}>Map</a>
							<Divider type='vertical'/>
							<a href='#' onClick={() => {this.props.gotoPage('/ui/wiki/view')}}>Wiki</a>
							<Divider type='vertical'/>
							<a href='#' onClick={() => {this.props.gotoPage('/ui/game')}}>Game</a>
							<Divider type='vertical'/>
						</div>
					</Col>
					<Col span={10}>
						{this.props.currentWorld ?
							<SearchBar
								searchWikis={this.props.searchWikis}
								wikiSearchResults={this.props.wikiSearchResults}
								findAndSetDisplayWiki={this.props.findAndSetDisplayWiki}
								currentWorld={this.props.currentWorld}
								showDrawer={this.props.showDrawer}
								gotoPage={this.props.gotoPage}
							/>
							: null
						}

					</Col>
					<Col span={6}>
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
		currentWorld: state.currentWorld,
		wikiSearchResults: state.wikiSearchResults
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
		gotoPage: (path, params = null, override=false) => {
			dispatch(UIActionFactory.gotoPage(path, params, override));
		},
		searchWikis: (params) => {
			dispatch(WikiActionFactory.searchWikis(params));
		},
		findAndSetDisplayWiki: (wikiId) => {
			dispatch(WikiActionFactory.findAndSetDisplayWiki(wikiId));
		},
		showDrawer: (show) => {
			dispatch(UIActionFactory.showDrawer(show));
		}
	}
};

const NavbarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(NavBar));


export default NavbarContainer;