import React, { Component } from 'react';
import {connect} from 'react-redux';
import UIActionFactory from "../redux/actions/uiactionfactory";
import {Button} from "antd";

class DefaultView extends Component {
	render(){
		let loginPrompt = <div>
			<Button type='primary' onClick={() => {this.props.showLogin(true)}}>Login</Button>
			<div className='padding-lg'> to create a world</div>
		</div>;
		if(this.props.currentUser){
			loginPrompt = <div className='padding-lg'><Button type='primary' onClick={() => {this.props.showCreateWorldModal(true)}}>Create World</Button></div>
		}
		return (
			<div className='text-align-center'>
				<div className='padding-lg'>No world selected.</div>
				<Button type='primary' onClick={() => {this.props.showSelectWorldModal(true)}}>Select World</Button>
				<div className='padding-lg'>or</div>
				{loginPrompt}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		currentUser: state.currentUser,
		currentWorld: state.currentWorld,
	}
};

const mapDispatchToProps = dispatch => {
	return {
		showLogin: (show) => {
			dispatch(UIActionFactory.showLoginModal(show))
		},
		showCreateWorldModal: (show) => {
			dispatch(UIActionFactory.showCreateWorldModal(show))
		},
		showSelectWorldModal: (show) => {
			dispatch(UIActionFactory.showSelectWorldModal(show))
		}
	}
};
const DefaultViewContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(DefaultView);

export default DefaultViewContainer;