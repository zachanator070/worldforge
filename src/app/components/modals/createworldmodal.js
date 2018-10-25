import {Component} from 'react';
import {Button, Checkbox, Col, Form, Input, Modal, Row} from "antd";
import React from "react";
class CreateWorldModal extends Component {

	constructor(props){
		super(props);
		this.state = {
			name: null,
			public: false,
		}
	}

	setName = (event) => {
		this.setState({name: event.target.value});
	};

	flipPublic = () => {
		this.setState({public: !this.state.public});
	};

	render(){
		let errorRow = <Row></Row>;
		if(this.props.error){
			errorRow = <Row><Col span={24}>{this.props.error}</Col></Row>
		}
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 14 },
		};
		const noLabelItem = {
			wrapperCol: { span: 10, offset: 4 }
		};
		return (
			<Modal
				title="Create World"
				visible={this.props.show}
				onCancel={() => {this.props.showCreateWorldModal(false)}}
				footer={null}
			>
				{errorRow}
				<Form layout='horizontal'>
					<Form.Item
						label="Name"
						required={true}
						{...formItemLayout}
					>
						<Input onChange={this.setName}/>
					</Form.Item>
					<Form.Item {...noLabelItem}>
						<Checkbox onChange={this.flipPublic}>
							Public World
						</Checkbox>
					</Form.Item>
					<Form.Item {...noLabelItem}>
						<Button type="primary" onClick={() => {this.props.createWorld(this.state.name, this.state.public)}}>Submit</Button>
					</Form.Item>
				</Form>
			</Modal>
		);
	}
}

export default CreateWorldModal;