import React, {Component} from 'react';
import {Col, Divider, List, Row} from "antd";
import ScaledImage from "./wiki/scaledimage";

class SelectPlace extends Component {
	getListItemComponent = (item) => {

		let itemClasses = '';
		if(this.props.selectedPlace && this.props.selectedPlace._id === item._id){
			itemClasses += 'selected';
		}

		if(item.name){
			return (
				<a href='#' onClick={async () => {
					this.props.setSelectedPlace(item);
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

		const content = this.props.selectedPlace ?
			<div>
				<h2>{this.props.selectedPlace.name}</h2>
				<img src={`/api/chunks/data/${this.props.selectedPlace.mapImage.icon.chunks[0]._id}`}/>
			</div>
			: 'No world selected';

		return (
			<div>
				<Row>
					<Col span={10}>
						<div className='padding-md-left padding-md-right text-align-center'>
							<h3 className='text-align-center'>Available Places</h3>
							<List
								bordered={true}
								itemLayout="horizontal"
								dataSource={this.props.availablePlaces || []}
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

export default SelectPlace;