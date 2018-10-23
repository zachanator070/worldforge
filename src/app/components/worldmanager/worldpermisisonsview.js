
import React, {Component} from 'react';
import {Button, Checkbox, Table} from "antd";

class WorldPermisisonsView extends Component {

	render(){

		const currentUserIsOwner = this.props.user && this.props.user._id === this.props.world.owner;

		const columns = [
			{
				title: 'Username',
				dataIndex: 'username',
				key: 'username',
			},
			{
				title: 'Read Permission',
				dataIndex: 'read',
				key: 'read',
				render: read => {
					const attributes = {};
					if(read){
						attributes.checked = true;
					}
					if(!currentUserIsOwner){
						attributes.disabled = true;
					}
					return <Checkbox {...attributes}/>
				}
			},
			{
				title: 'Write Permission',
				dataIndex: 'write',
				key: 'write',
				render: write => {
					const attributes = {};
					if(write){
						attributes.checked = true;
					}
					if(!currentUserIsOwner){
						attributes.disabled = true;
					}
					return <Checkbox {...attributes}/>
				}
			},
		];

		const publicWorldAttributes ={};
		if(this.props.world.public){
			publicWorldAttributes.checked = true;
		}
		if(!currentUserIsOwner){
			publicWorldAttributes.disabled = true;
		}

		return (
			<div>
				<Table className='width-65 padding-md' columns={columns} dataSource={this.state.users} />
				<div>
				<Checkbox {...publicWorldAttributes}>Public World</Checkbox>
				</div>
				<div className='padding-md'>
						<Button onClick={this.showAddUser}>Add User</Button>
				</div>
			</div>
		);
	}
}