import React, {Component} from 'react';
import LoginActionFactory from "../../redux/actions/loginactionfactory";
import UIActionFactory from "../../redux/actions/uiactionfactory";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";
import Quill from 'quill';
import {Button, Col, Row} from "antd";

class Wiki extends Component{

	componentDidMount(){
		console.log('wiki mounted');
	}

	render(){

		return(
			<Row>
				<Col span={4}>
					<Button onClick={this.props.showCreateWikiModal}>New Page</Button>
				</Col>
				<Col span={20}>
					<div id='editor'></div>
				</Col>
			</Row>
		);
	}
}

const mapStateToProps = state => {
	return {
	}
};

const mapDispatchToProps = dispatch => {
	return {
	}
};

const WikiContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(Wiki));

export default WikiContainer;