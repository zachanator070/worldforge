import React, {Component} from 'react';
import {Dropdown, Icon, Menu} from "antd";
import CreateWorldForm from "../worldmanager/createworldform";
import SelectWorldForm from "../worldmanager/selectworldform";

class WorldMenu extends Component{

	constructor(props){
		super(props);
		this.state = {
			showCreateWorld: false,
			showSelectWorld: false
		}
	}

	selectWorldCallback = (world) => {
		this.setState({showSelectWorld: false});
		if(world){
			this.props.dispatchWorldSelected(world);
		}
	};

	createWorldCallback = (world) => {
		this.setState({showCreateWorld: false});
		if(world){
			this.props.dispatchWorldSelected(world);
		}
	};

	render(){

		const menu = (
			<Menu>
				<Menu.Item key="0">
					<a href="#" onClick={() => {this.setState({showCreateWorld: true})}}>New World</a>
				</Menu.Item>
				<Menu.Item key="1">
					<a href="#" onClick={() => {this.setState({showSelectWorld: true})}}>Select World</a>
				</Menu.Item>
			</Menu>
		);

		return(
			<div>
				<Dropdown overlay={menu} trigger={['click']}>
					<a className="ant-dropdown-link" href="#">
						{this.props.world ? this.props.world.name : 'No World Selected' } <Icon type="down" />
					</a>
				</Dropdown>
				<CreateWorldForm show={this.state.showCreateWorld} callback={this.createWorldCallback}/>
				<SelectWorldForm show={this.state.showSelectWorld} callback={this.selectWorldCallback}/>
			</div>
		);
	}
}

export default WorldMenu;