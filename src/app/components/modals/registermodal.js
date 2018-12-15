import React, { Component } from 'react';
import {Button, Form, Icon, Input, Modal} from "antd";

class RegisterModal extends Component {

	constructor(props){
		super(props);
		this.state = {
			email: '',
			password: '',
			repeatPassword: '',
			displayName: ''
		};
	}

	updateEmail = (event) => {
		const value = event.target.value;
		this.setState((state) => {
			return { email: value};
		});
	};

	updatePassword = (event) => {
		const value = event.target.value;
		this.setState((state) => {
			return { password: value };
		});
	};

	updateRepeatPassword = (event) => {
		const value = event.target.value;
		this.setState((state) => {
			return { repeatPassword: value };
		});
	};

	updateDisplayName = (event) => {
		const value = event.target.value;
		this.setState((state) => {
			return { displayName: value };
		});
	};

	render() {

		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 14 },
		};
		const noLabelItem = {
			wrapperCol: { span: 10, offset: 4 }
		};

		return (
			<div>
				<Modal
					title="Register"
					visible={this.props.show}
					centered
					onCancel={this.props.cancel}
					footer={null}
				>
					<Form layout='horizontal' onSubmit={() => {this.props.register(this.state.email, this.state.password, this.state.displayName)}}>
						<Form.Item label="Email" {...formItemLayout}>
							<Input
								placeholder="zach@thezachcave.com"
								prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
								value={this.state.email}
								onChange={this.updateEmail}
							/>
						</Form.Item>
						<Form.Item label="Display Name" {...formItemLayout}>
							<Input
								placeholder="DragonSlayer1234"
								prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
								value={this.state.displayName}
								onChange={this.updateDisplayName}
							/>
						</Form.Item>
						<Form.Item label="Password" {...formItemLayout} >
							<Input
								placeholder="$up3r$3cr37"
								prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
								value={this.state.password}
								onChange={this.updatePassword}
								type='password'/>
						</Form.Item>
						<Form.Item label="Repeat Password" {...formItemLayout} >
							<Input
								placeholder="$up3r$3cr37"
								prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
								value={this.state.repeatPassword}
								onChange={this.updateRepeatPassword}
								type='password'/>
						</Form.Item>
						<Form.Item {...noLabelItem}>
							<Button type="primary" htmlType="submit">Register</Button>
						</Form.Item>
					</Form>
				</Modal>
			</div>
		);
	}
}

export default RegisterModal;