
import React, {Component} from 'react';
import LoginActionFactory from "../../redux/actions/loginactionfactory";
import UIActionFactory from "../../redux/actions/uiactionfactory";
import WorldActionFactory from "../../redux/actions/worldactionfactory";
import RegisterActionFactory from "../../redux/actions/registeractionfactory";
import connect from "react-redux/es/connect/connect";
import LoginModal from "./loginmodal";
import RegisterModal from "./registermodal";
import SelectWorldModal from "./selectworldmodal";
import CreateWorldModal from "./createworldmodal";
import EditPinModal from "./editpinmodal";

class Modals extends Component {
	render(){
		return (
			<div>
				<LoginModal
					show={this.props.ui.showLoginModal}
					error={this.props.loginRequest.error}
					cancel={() => {this.props.showLogin(false);}}
					login={(username, password) => {
						this.props.dispatchTryLogin(username, password);
					}}
				/>
				<RegisterModal
					show={this.props.ui.showRegisterModal}
					error={this.props.registerRequest.error}
					cancel={() => {this.props.showRegister(false);}}
					register={this.props.tryRegister}
				/>
				<SelectWorldModal
					show={this.props.ui.showSelectWorldModal}
					showSelectWorldModal={this.props.showSelectWorldModal}
					submitSelectWorldModal={this.props.submitSelectWorldModal}
					availableWorlds={this.props.availableWorlds}
					displayWorld={this.props.displayWorld}
					setDisplayWorld={this.props.setDisplayWorld}
				/>
				<CreateWorldModal
					show={this.props.ui.showCreateWorldModal}
					error={this.props.createWorldRequest.error}
					createWorld={this.props.createWorld}
					showCreateWorldModal={this.props.showCreateWorldModal}
				/>
				<EditPinModal
					pin={this.props.pinBeingEdited}
					updatePin={this.props.updatePin}
					deletePin={this.props.deletePin}
					allWikis={this.props.allWikis}
					show={this.props.ui.showEditPinModal}
					showEditPinModal={this.props.showEditPinModal}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		loginRequest: state.loginRequest,
		registerRequest: state.registerRequest,
		getAvailableWorldsRequest: state.getAvailableWorldsRequest,
		createWorldRequest: state.createWorldRequest,
		currentUser: state.currentUser,
		ui: state.ui,
		currentWorld: state.currentWorld,
		availableWorlds: state.availableWorlds,
		displayWorld: state.displayWorld,
		allWikis: state.allWikis,
		pinBeingEdited: state.pinBeingEdited
	}
};

const mapDispatchToProps = dispatch => {
	return {
		dispatchTryLogin: (username, password) => {
			dispatch(LoginActionFactory.tryLogin(username, password));
		},
		showLogin: (show) => {
			dispatch(UIActionFactory.showLoginModal(show));
		},
		showRegister: (show) => {
			dispatch(UIActionFactory.showRegistrationModal(show));
		},
		showCreateWorldModal: (show) => {
			dispatch(UIActionFactory.showCreateWorldModal(show));
		},
		showSelectWorldModal: (show) => {
			dispatch(UIActionFactory.showSelectWorldModal(show));
		},
		submitSelectWorldModal: (world) => {
			dispatch(UIActionFactory.submitSelectWorldModal(world));
		},
		createWorld: (name, isPublic) => {
			dispatch(WorldActionFactory.createWorld(name, isPublic));
		},
		tryRegister: (email, password, displayName) => {
			dispatch(RegisterActionFactory.tryRegister(email, password, displayName));
		},
		setDisplayWorld: (world) => {
			dispatch(WorldActionFactory.displayWorld(world));
		},
		showEditPinModal: (show) => {
			dispatch(UIActionFactory.showEditPinModal(show));
		}
	}
};

const ModalsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Modals);


export default ModalsContainer;