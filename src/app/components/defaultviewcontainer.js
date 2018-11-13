import React, { Component } from 'react';
import {connect} from 'react-redux';
import UIActionFactory from "../redux/actions/uiactionfactory";
import {Button} from "antd";

class DefaultView extends Component {
	render(){
		let loginPrompt = <div>
			<Button type='primary' onClick={() => {this.props.showLogin()}}>Login</Button>
			<div className='padding-lg'> to create a world</div>
		</div>;
		if(this.props.currentUser){
			loginPrompt = <div className='padding-lg'><Button type='primary' onClick={() => {this.props.showCreateWorldModal()}}>Create World</Button></div>
		}
		return (
			<div className='text-align-center'>
				<div className='padding-lg'>No world selected.</div>
				<Button type='primary' onClick={() => {this.props.showSelectWorldModal()}}>Select World</Button>
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
		showLogin: () => {
			dispatch(UIActionFactory.showLoginModal())
		},
		showCreateWorldModal: () => {
			dispatch(UIActionFactory.showCreateWorldModal())
		},
		showSelectWorldModal: () => {
			dispatch(UIActionFactory.showSelectWorldModal())
		}
	}
};
const DefaultViewContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(DefaultView);

export default DefaultViewContainer;