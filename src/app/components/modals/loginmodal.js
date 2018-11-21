import React, { Component } from 'react';
import {Button, Form, Icon, Input, Modal} from "antd";

class LoginModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: ''
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
					title="Login"
					visible={this.props.show}
					centered
					onCancel={this.props.cancel}
					footer={null}
				>
					<Form layout='horizontal' onSubmit={() => {this.props.login(this.state.email, this.state.password)}}>
						<Form.Item
							label="Email"
							{...formItemLayout}
						>
								<Input
									placeholder="zach@thezachcave.com"
									prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
									value={this.state.email}
									onChange={this.updateEmail}
								/>
						</Form.Item>
						<Form.Item
							label="Password"
							{...formItemLayout}
						>
							<Input
								placeholder="$up3r$3cr37"
								prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
								value={this.state.password}
								onChange={this.updatePassword}
								type='password'/>
						</Form.Item>
						<Form.Item
							{...noLabelItem}>
							<Button type="primary" htmlType="submit">Login</Button>
						</Form.Item>
					</Form>
				</Modal>
			</div>
		);
	}
}

export default LoginModal;