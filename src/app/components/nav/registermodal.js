import React, { Component } from 'react';
import {Button, Icon, Input, Modal} from "antd";

class RegisterModal extends Component {

	constructor(props){
		super(props);
		this.state = {
			email: '',
			password: '',
			repeatPassword: '',
			error: '',
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

	register = () => {
		this.hideRegister();
		if(this.state.repeatPassword !== this.state.password){
			this.setState({
				error: "Passwords do not match!"
			});
			return;
		}
		fetch(
			'/api/auth/register',
			{
				method: 'POST',
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify(this.state)
			}
		).then((response) => {
			if(response.status === 200){
				fetch(
					'/api/users/current',
					{
						method: "GET"
					}
				).then((userResponse) => {
					userResponse.json().then((data) => {
						this.props.callback(data);
					});
				});
			} else {
				response.json().then((data) => {
				this.setState({
					error: data.error
				});
			});
		}
		});
	};

	render() {
		let errorBox = <div></div>;
		if(this.state.error){
			errorBox = <div>{this.state.error}</div>;
		}
		return (
			<div>
				<Modal
					title="Register"
					visible={this.props.show}
					centered
					onCancel={this.hideRegister}
					footer={[
						<Button type='primary' onClick={this.register}>Register</Button>
					]}
				>
					{errorBox}
					<form>
						<div className='text-align-right'>
							Email:
							<div className='margin-sm width-65 inline-block'>
								<Input
									className='width-65'
									placeholder="zach@thezachcave.com"
									prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
									value={this.state.email}
									onChange={this.updateEmail}/>
							</div>
						</div>
						<div className='text-align-right'>
							Password:
							<div className='margin-sm width-65 inline-block'>
								<Input
									placeholder="$up3r$3cr37"
									prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
									value={this.state.password}
									onChange={this.updatePassword}
									type='password'/>
								</div>
						</div>
						<div className='text-align-right'>
							Repeat Password:
							<div className='margin-sm width-65 inline-block'>
								<Input placeholder="$up3r$3cr37"
									   prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
									   value={this.state.repeatPassword}
									   onChange={this.updateRepeatPassword}
									   type='password'/>
							</div>
						</div>
					</form>
				</Modal>
			</div>
		);
	}
}

export default RegisterModal;