
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
import MapActionFactory from "../../redux/actions/mapactionfactory";
import WorldPermissionsModal from "./worldpermissionsview";

class Modals extends Component {
	render(){
		return (
			<div>
				<LoginModal
					show={this.props.ui.showLoginModal}
					cancel={() => {this.props.showLogin(false);}}
					login={(username, password) => {
						this.props.dispatchTryLogin(username, password);
					}}
				/>
				<RegisterModal
					show={this.props.ui.showRegisterModal}
					cancel={() => {this.props.showRegister(false);}}
					register={this.props.tryRegister}
				/>
				<SelectWorldModal
					show={this.props.ui.showSelectWorldModal}
					showSelectWorldModal={this.props.showSelectWorldModal}
					submitSelectWorldModal={this.props.submitSelectWorldModal}
					availableWorlds={this.props.availableWorlds}
					currentWorld={this.props.currentWorld}
				/>
				<CreateWorldModal
					show={this.props.ui.showCreateWorldModal}
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
				<WorldPermissionsModal
					updateWorld={this.props.updateWorld}
					currentWorld={this.props.currentWorld}
					currentUser={this.props.currentUser}
					showWorldPermissionModal={this.props.ui.showWorldPermissionModal}
					setShowWorldPermissionModal={this.props.setShowWorldPermissionModal}
					userSearch={this.props.userSearch}
					userSearchResults={this.props.userSearchResults}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		getAvailableWorldsRequest: state.getAvailableWorldsRequest,
		currentUser: state.currentUser,
		ui: state.ui,
		currentWorld: state.currentWorld,
		availableWorlds: state.availableWorlds,
		allWikis: state.allWikis,
		pinBeingEdited: state.pinBeingEdited,
		userSearchResults: state.userSearchResults
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
		showEditPinModal: (show) => {
			dispatch(UIActionFactory.showEditPinModal(show));
		},
		updatePin: (pin) => {
			dispatch(MapActionFactory.updatePin(pin));
		},
		deletePin: (pin) => {
			dispatch(MapActionFactory.deletePin(pin));
		},
		tryLogout: () => {
			dispatch(LoginActionFactory.tryLogout());
		},
		updateWorld: (world) => {
			dispatch(WorldActionFactory.updateWorld(world));
		},
		setShowWorldPermissionModal: (show) => {
			dispatch(UIActionFactory.showWorldPermissionModal(show));
		},
		userSearch: (username) => {
			dispatch(WorldActionFactory.userSearch(username));
		}
	}
};

const ModalsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Modals);


export default ModalsContainer;