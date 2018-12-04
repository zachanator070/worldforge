import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";

import UIActionFactory from "../../redux/actions/uiactionfactory";
import {Button, Col, Form, Icon, Input, Row, Tabs} from "antd";
import GameActionFactory from "../../redux/actions/gameactionfactory";
import DefaultGameView from "./defaultgameview";
import SlidingDrawer from "../slidingdrawer";
import GameMessenger from "./gamemessenger";
import WikiView from "../wiki/wikiview";
import SelectPlace from "../selectplace";


class GameView extends Component{


	constructor(props){
		super(props);
		this.state = {
			width: 0,
			height: 0,
			selectedPlace: null
		};
	}

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

	setSelectedPlace = (place) => {
		this.setState({
			selectedPlace: place
		});
	};

	render() {
		if(!this.props.currentUser){
			return(
				<div className='text-align-center'>
					<div className='margin-lg-top'>
						Please
					</div>
					<div className='margin-lg-top'>
						<Button type="primary" onClick={() => {this.props.showLoginModal(true)}}>Login</Button>
					</div>
					<div className='margin-lg-top'>
						to join a session
					</div>
				</div>
			);
		}
		if(!this.props.currentGame.game){
			return (
				<DefaultGameView
					createGame={this.props.createGame}
					joinGame={this.props.joinGame}
					availableWorlds={this.props.availableWorlds}
				/>
			);
		}

		if(this.state.width === 0){
			return null;
		}

		return (
			<div>
				{this.props.displayWiki ?
					<SlidingDrawer
						side='left'
						show={this.props.ui.showLeftDrawer}
						setShow={this.props.showLeftDrawer}
						height={this.state.height}
						maxWidth={this.state.width}
					>
						<WikiView
							gotoPage={this.props.gotoPage}
							currentWiki={this.props.displayWiki}
							currentWorld={this.props.currentWorld}
						/>
					</SlidingDrawer>
					: null}
				<div style={{display: 'inline'}}>
					Map ID: {this.props.currentGame.game.mapImage ? this.props.currentGame.game.mapImage._id: null}
				</div>

				<SlidingDrawer
					side='right'
					show={this.props.ui.showRightDrawer}
					setShow={this.props.showRightDrawer}
					height={this.state.height}
					maxWidth={this.state.width}
				>
					<div className='margin-md'>
						<span className='margin-md-right'>
							Game ID: {this.props.currentGame.game._id}
						</span>
						<Button type='danger' onClick={() => {this.props.leaveGame();}}>Leave</Button>
					</div>
					<Tabs defaultActiveKey="1">
						<Tabs.TabPane tab={<span><Icon type="message" />Messages</span>} key="1">
							<GameMessenger
								messages={this.props.currentGame.game.messages}
								sendMessage={this.props.sendMessage}
							/>
						</Tabs.TabPane>
						<Tabs.TabPane tab={<span><Icon type="compass" />Location</span>} key="2">
							<SelectPlace
								selectedPlace={this.state.selectedPlace}
								setSelectedPlace={this.setSelectedPlace}
								availablePlaces={this.props.allWikis.filter((wiki) => {return wiki.type === 'place' && wiki.mapImage})}
							/>
							<Button
								type='primary'
								className='margin-md-top'
								disabled={!this.state.selectedPlace}
								onClick={() => {this.props.setMap(this.state.selectedPlace.mapImage._id);}}
							>Change Map</Button>
						</Tabs.TabPane>
					</Tabs>
				</SlidingDrawer>

			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		currentUser: state.currentUser,
		currentGame: state.currentGame,
		ui: state.ui,
		displayWiki: state.displayWiki,
		currentWorld: state.currentWorld,
		availableWorlds: state.availableWorlds,
		allWikis: state.allWikis
	}
};

const mapDispatchToProps = dispatch => {
	return {
		showLoginModal: (show) => {
			dispatch(UIActionFactory.showLoginModal(show));
		},
		joinGame: (gameId, password) => {
			dispatch(GameActionFactory.joinGame(gameId, password));
		},
		createGame: (worldId, password) => {
			dispatch(GameActionFactory.createGame(worldId, password));
		},
		showLeftDrawer: (show) => {
			dispatch(UIActionFactory.showLeftDrawer(show));
		},
		showRightDrawer: (show) => {
			dispatch(UIActionFactory.showRightDrawer(show));
		},
		sendMessage: (message) => {
			dispatch(GameActionFactory.sendMessage(message));
		},
		gotoPage:(page) => {
			dispatch(UIActionFactory.gotoPage(page));
		},
		leaveGame: () => {
			dispatch(GameActionFactory.leaveGame());
		},
		setMap: (imageId) => {
			dispatch(GameActionFactory.setMap(imageId))
		}
	}
};

const GameContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(GameView);

export default GameContainer;