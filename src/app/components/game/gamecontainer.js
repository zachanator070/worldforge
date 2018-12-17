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
import MapCanvas from "../map/mapcanvas";


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
		if(this.refs.container && (this.refs.container.offsetWidth !== this.state.width || this.refs.container.offsetHeight !== this.state.height)){
			this.setState({ width: this.refs.container.offsetWidth, height: this.refs.container.offsetHeight});
		}
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.updateWindowDimensions();
	}

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

		let canvas = this.props.currentGame && this.props.currentGame.game && this.props.currentGame.game.mapImage && this.props.currentGame.game.mapImage.chunks ? <MapCanvas
			setCurrentMapPosition={this.props.setGameMapPosition}
			setCurrentMapZoom={this.props.setGameMapZoom}
			currentMap={{
				x: this.props.currentGame.x,
				y: this.props.currentGame.y,
				zoom: this.props.currentGame.zoom,
				image: this.props.currentGame.game.mapImage,
			}}
			currentWorld={this.props.currentWorld}
			getAndSetMap={() => {

			}}
		/> :
			<div className='text-align-center'><h2>No Map Selected</h2></div>;

		return (
			<div ref='container' style={{position: 'relative'}} className='overflow-hidden flex-column flex-grow-1'>
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
							allPins={this.props.allPins}
						/>
					</SlidingDrawer>
					: null}
				{canvas}

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
		},
		setGameMapPosition: (x, y) => {
			dispatch(GameActionFactory.setGameMapPosition(x, y));
		},
		setGameMapZoom: (zoom) => {
			dispatch(GameActionFactory.setGameMapZoom(zoom));
		}
	}
};

const GameContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(GameView);

export default GameContainer;