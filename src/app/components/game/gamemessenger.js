import React, {Component} from 'react';
import {Button, Input} from "antd";

class GameMessenger extends Component{

	constructor(props){
		super(props);
		this.state = {
			newMessage: ''
		};
	}

	sendMessage = () => {
		this.props.sendMessage(this.state.newMessage);
		this.setState({
			newMessage: ''
		});
	};

	checkEnterKey = (event) => {
		if(event.key === 'Enter'){
			this.sendMessage();
		}
	};

	setMessage = (event) => {
		this.setState({
			newMessage: event.target.value
		})
	};

	scrollToBottom = () => {
		this.refs.messageDiv.scrollTop = this.refs.messageDiv.scrollHeight;
	};

	componentDidMount() {
		this.scrollToBottom();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.scrollToBottom();
	}

	render(){
		let messages = [];
		for(let message of this.props.messages){
			messages.push(<div key={`${message.sender}:${message.timeStamp}`}>{message.sender}: {message.message}</div>)
		}
		return (
			<div>
				<div className='message-box' ref='messageDiv'>
					{messages}
				</div>
				<div className='margin-md'>
					<Input value={this.state.newMessage} onKeyDown={this.checkEnterKey} onChange={this.setMessage} type='text' />
				</div>
				<Button type='primary' onClick={this.sendMessage}>Send</Button>
			</div>
		);
	}
}

export default GameMessenger;