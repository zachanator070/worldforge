import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";

import UIActionFactory from "../../redux/actions/uiactionfactory";
import {Button, Col, Form, Icon, Input, Row} from "antd";
import GameActionFactory from "../../redux/actions/gameactionfactory";


class GameView extends Component{

	constructor(props) {
		super(props);
		this.state = {
			gameId: '',
			password: '',
			createGamePassword: ''
		};
	}

	updatePassword = (event) => {
		const value = event.target.value;
		this.setState((state) => {
			return { password: value };
		});
	};

	updateGameId = (event) => {
		const value = event.target.value;
		this.setState((state) => {
			return { gameId: value };
		});
	};

	updateCreateGamePassword = (event) => {
		const value = event.target.value;
		this.setState((state) => {
			return { createGamePassword: value };
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
			const formItemLayout = {
				labelCol: { span: 5 },
				wrapperCol: { span: 14 },
			};
			const noLabelItem = {
				wrapperCol: { span: 10, offset: 5 }
			};
			return(
				<Row>
					<Col span={8}></Col>
					<Col span={8}>
						<div className='margin-lg-top'>
							<Form
								layout='horizontal'
								onSubmit={() => {this.props.createGame(this.state.createGamePassword)}}
								className='margin-md-top'
							>
								<Form.Item {...noLabelItem}>
									<h2>Create Game</h2>
								</Form.Item>
								<Form.Item
									label="Game Password"
									{...formItemLayout}
								>
									<Input
										placeholder="$up3r$3cr37"
										prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
										value={this.state.createGamePassword}
										onChange={this.updateCreateGamePassword}
										type='password'/>
								</Form.Item>
								<Form.Item
									{...noLabelItem}>
									<Button type="primary" htmlType="submit">Create</Button>
								</Form.Item>
							</Form>
						</div>
						<div className='margin-lg-top'>
							<Form
								layout='horizontal'
								onSubmit={() => {this.props.joinGame(this.state.gameId, this.state.password)}}
							>
								<Form.Item {...noLabelItem}>
									<h2>Join game</h2>
								</Form.Item>
								<Form.Item
									label="Game ID"
									{...formItemLayout}
								>
									<Input
										placeholder="123456789"
										value={this.state.gameId}
										onChange={this.updateGameId}
									/>
								</Form.Item>
								<Form.Item
									label="Game Password"
									{...formItemLayout}
								>
									<Input
										placeholder="$up3r$3cr37"
										prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
										value={this.state.password}
										onChange={this.updatePassword}
										type='password'/>
								</Form.Item>
								<Form.Item
									{...noLabelItem}>
									<Button type="primary" htmlType="submit">Join</Button>
								</Form.Item>
							</Form>
						</div>
					</Col>
					<Col span={8}></Col>
				</Row>
			);
		}

		return (
			<div>
				In game {this.props.currentGame.game._id}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		currentUser: state.currentUser,
		currentGame: state.currentGame
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
		createGame: (password) => {
			dispatch(GameActionFactory.createGame(password));
		}
	}
};

const GameContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(GameView);

export default GameContainer;