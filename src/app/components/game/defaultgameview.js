
import React, {Component} from 'react';
import {Button, Col, Icon, Input, Row} from "antd";
import {Form} from "antd";
import WorldSelect from "../worldselect";
import {message} from 'antd';

class DefaultGameView extends Component{

	constructor(props) {
		super(props);
		this.state = {
			gameId: '',
			password: '',
			createGamePassword: '',
			selectedWorld: null
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

	setSelectedWorld = (world) => {
		this.setState({
			selectedWorld: world
		});
	};

	render(){
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
							onSubmit={() => {return false;}}
							className='margin-md-top'
						>
							<Form.Item {...noLabelItem}>
								<h2>Create Game</h2>
							</Form.Item>
							<WorldSelect
								selectedWorld={this.state.selectedWorld}
								setSelectedWorld={this.setSelectedWorld}
								availableWorlds={this.props.availableWorlds}
							/>
							<Form.Item
								label="Game Password"
								{...formItemLayout}
							>
								<Input
									placeholder="$up3r$3cr37"
									prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
									value={this.state.createGamePassword}
									onChange={this.updateCreateGamePassword}
									type='password'
									name='createGamePassword'
								/>
							</Form.Item>
							<Form.Item
								{...noLabelItem}>
								<Button type="primary" htmlType="button" onClick={() => {
									if(!this.state.selectedWorld){
										message.error('No World Selected');
										return;
									}
									this.props.createGame(this.state.selectedWorld._id, this.state.createGamePassword);
								}}>Create</Button>
							</Form.Item>
						</Form>
					</div>
					<div className='margin-lg-top'>
						<Form
							layout='horizontal'
							onSubmit={() => {return false;}}
							autoComplete="off"
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
									name='gameId'
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
									type='password'
									name='joinGamePassword'
								/>
							</Form.Item>
							<Form.Item
								{...noLabelItem}>
								<Button type="primary" htmlType="button" onClick={() => {this.props.joinGame(this.state.gameId, this.state.password)}}>Join</Button>
							</Form.Item>
						</Form>
					</div>
				</Col>
				<Col span={8}></Col>
			</Row>
		);
	}
}

export default DefaultGameView;