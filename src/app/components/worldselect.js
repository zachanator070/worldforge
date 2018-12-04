
import React, {Component} from 'react';
import {List} from "antd";
import {Col, Divider, Row} from "antd";

class WorldSelect extends Component{

	getListItemComponent = (item) => {

		let itemClasses = '';
		if(this.props.selectedWorld && this.props.selectedWorld._id === item._id){
			itemClasses += 'selected';
		}

		if(item.name){
			return (
				<a href='#' onClick={async () => {
					this.props.setSelectedWorld(item);
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

		const content = this.props.selectedWorld ?
				<div>
					<h2>{this.props.selectedWorld.name}</h2>
					<h3>Owner: {this.props.selectedWorld.owner.displayName}</h3>
				</div>
				: 'No world selected';

		return (
			<div>
				<Row>
					<Col span={10}>
						<div className='padding-md-left padding-md-right text-align-center'>
							<h3 className='text-align-center'>Available Worlds</h3>
							<List
								bordered={true}
								itemLayout="horizontal"
								dataSource={this.props.availableWorlds || []}
								renderItem={this.getListItemComponent}
							/>
						</div>
						<Divider type="vertical" />
					</Col>
					<Col span={14}>
						{content}
					</Col>
				</Row>
			</div>
		);

	}
}

export default WorldSelect;