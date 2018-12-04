import React, {Component} from 'react';
import {Button, Dropdown, Icon, Menu} from "antd";
import CreateWorldForm from "../modals/createworldmodal";
import Selectworldmodal from "../modals/selectworldmodal";

class WorldMenu extends Component{

	constructor(props){
		super(props);
	}

	render(){

		const menu = (
			<Menu>
				{(this.props.currentUser !== null ?
					<Menu.Item key="0">
						<a href="#" onClick={() => {this.props.showCreateWorldModal(true)}}>New World</a>
					</Menu.Item>
					: null)}
				<Menu.Item key="1">
					<a href="#" onClick={() => {this.props.showSelectWorldModal(true)}}>Select World</a>
				</Menu.Item>
			</Menu>
		);

		return(
			<div>
				<Dropdown overlay={menu} trigger={['click']}>
					<Button>
						{this.props.currentWorld ? this.props.currentWorld.name : 'No World Selected' } <Icon type="down" />
					</Button>
				</Dropdown>
			</div>
		);
	}
}

export default WorldMenu;