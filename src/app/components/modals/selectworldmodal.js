import React, { Component } from 'react';
import {Button, Checkbox, Col, Divider, Form, Input, List, Modal, Row} from "antd";

class SelectWorldModal extends Component {

	constructor(props){
		super(props);
	}

	getListItemComponent = (item) => {

		let itemClasses = '';
		if(this.props.displayWorld && this.props.displayWorld._id === item._id){
			itemClasses += 'selected';
		}

		if(item.name){
			let copy = Object.assign({}, item);
			return (
				<a href='#' onClick={async () => {
					this.props.setDisplayWorld(item);
				}}>
					<List.Item className={itemClasses} key={item.name}>
						{item.name}
					</List.Item>
				</a>
			);
		}
		else {
			return (
				<List.Item className='text-align-right' key={item}>
					{item}
				</List.Item>
			);
		}
	};

	render(){

		let title = 'Select World';
		if(this.props.title){
			title = this.props.title;
		}
		return(
			<Modal
				title="Select a World"
				visible={this.props.show}
				onCancel={() => {this.props.showSelectWorldModal(false)}}
				footer={[
					<Button
						type={'primary'}
						key='select button'
						onClick={() => {
							this.props.submitSelectWorldModal(this.props.displayWorld._id);
						}}
						disabled={this.props.displayWorld === null}
					>
						Select
					</Button>
				]}
			>
				<div className='text-align-center padding-lg'>
					<h1>
						{title}
					</h1>
				</div>
				<Row>
					<Col span={10}>
						<div className='padding-lg text-align-center'>
							<h3 className='text-align-center'>Worlds Available</h3>
							<List
								bordered={true}
								itemLayout="horizontal"
								dataSource={this.props.availableWorlds}
								renderItem={this.getListItemComponent}
							/>
						</div>
						<Divider type="vertical" />
					</Col>
					<Col span={14}>
						{this.props.displayWorld !== null ?
							<div>
								<h2>{this.props.displayWorld.name}</h2>
								<h3>Owner: {this.props.displayWorld.owner.displayName}</h3>
							</div>
							: 'No world selected'}
					</Col>
				</Row>
			</Modal>
		);
	}
}

export default SelectWorldModal;