import React, { Component } from 'react';
import {Button, Checkbox, Col, Divider, Form, FormItem, Input, List, Modal, Row} from "antd";
import CreateWorldForm from "./createworldform";

class SelectWorldForm extends Component {

	constructor(props){
		super(props);
		this.state = {
			availableWorlds: ['Loading'],
			displayWorld: null,
			error: null
		};
	}

	fetchWorlds = () => {
		this.setState({displayWorld: null});
		return fetch(
			'/api/worlds',
			{
				method: 'GET'
			}
		).then((response) => {
			if(response.status !== 200){
				response.json().then((data) => {this.setState({error: data.error});});
			} else {
				response.json().then((data) => {this.setState({availableWorlds: data});});
			}
		});
	};

	setDisplayWorld = (world) => {
		this.setState({
			displayWorld: world
		});
	};

	getListItemComponent = (item) => {

		let itemClasses = '';
		if(this.state.displayWorld && this.state.displayWorld._id === item._id){
			itemClasses += 'selected';
		}

		if(item.name){
			let copy = {};
			copy = Object.assign(item, copy);
			return (
				<a href='#' onClick={() => {this.setDisplayWorld(item)}}>
					<List.Item className={itemClasses}>
						{item.name}
					</List.Item>
				</a>
			);
		}
		else {
			return (
				<List.Item className='text-align-right'>
					{item}
				</List.Item>
			);
		}
	};

	render(){

		if(this.props.show){
			this.fetchWorlds();
		}

		let title = 'Select World';
		if(this.props.title){
			title = this.props.title;
		}
		let errorRow = <Row></Row>;
		if(this.state.error){
			errorRow = <Row><Col span={24}>{this.state.error}</Col></Row>
		}
		return(
			<Modal
				title="Create World"
				visible={this.props.show}
				onCancel={() => {this.props.callback()}}
				footer={[
					<Button type={'primary'} onClick={() => {this.callback(this.state.displayWorld)}} disabled={this.state.displayWorld === null}>Select</Button>
				]}
			>
				<div className='text-align-center padding-lg'>
					<h1>
						{title}
					</h1>
				</div>
				{errorRow}
				<Row>
					<Col span={10}>
						<div className='padding-lg text-align-center'>
							<h3 className='text-align-center'>Worlds Available</h3>
							<List
								bordered={true}
								itemLayout="horizontal"
								dataSource={this.state.availableWorlds}
								renderItem={this.getListItemComponent}
							/>
						</div>
						<Divider type="vertical" />
					</Col>
					<Col span={14}>
						{this.state.displayWorld !== null ?
							<div>
								<h2>{this.state.displayWorld.name}</h2>
								<h3>Owner: {this.state.ownerUserName}</h3>
								<div className='padding-md'>
									<Button type='primary' onClick={() => {
										this.dispatchWorldSelected(this.props.world);
										this.props.callback()
									}}>
										Use this world now
									</Button>
								</div>
							</div>
							: 'No world selected'}
					</Col>
				</Row>
			</Modal>
		);
	}
}

export default SelectWorldForm;