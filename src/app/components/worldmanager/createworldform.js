import {Component} from 'react';
import {Button, Checkbox, Col, Form, Input, Modal, Row} from "antd";
import React from "react";
class CreateWorldForm extends Component {

	constructor(props){
		super(props);
		this.state = {
			name: null,
			public: false,
			error: null
		}
	}

	createWorld = () => {
		this.setState({error: null});
		this.setState({public: null});
		this.setState({name: null});
		fetch(
			'/api/worlds',
			{
				method: 'POST',
				body: JSON.stringify(this.state),
				headers: {
					"Content-Type": "application/json; charset=utf-8",
				}
			}
		).then((response) => {
			if(response.status !== 200){
				response.json().then((data) => {
					this.setState({error: data.error});
				});
			} else {
				response.json().then((data) => {
					this.props.callback(data);
				});
			}
		})
	};

	setName = (event) => {
		this.setState({name: event.target.value});
	};

	flipPublic = () => {
		this.setState({public: !this.state.public});
	};

	render(){
		let errorRow = <Row></Row>;
		if(this.state.error){
			errorRow = <Row><Col span={24}>{this.state.error}</Col></Row>
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
				onCancel={() => {this.props.callback()}}
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
						<Button type="primary" onClick={this.createWorld}>Submit</Button>
					</Form.Item>
				</Form>
			</Modal>
		);
	}
}

export default CreateWorldForm;