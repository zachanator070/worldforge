import React, {Component} from 'react';
import {Icon} from "antd";
import ScaledImage from "./scaledimage";

class WikiView extends Component{

	constructor(props){
		super(props);
		this.editor = null;
		this.state = {
			width: 0,
			height: 0
		}
	}

	componentDidMount(){
		this.initQuill();
		if(this.props.currentWiki){
			this.setState({
				width: this.refs.wikiView.offsetWidth,
				height: this.refs.wikiView.offsetHeight
			});
		}
	}

	componentDidUpdate(){
		this.initQuill();
		if(this.props.currentWiki && (this.refs.wikiView.offsetWidth !== this.state.width || this.refs.wikiView.offsetHeight !== this.state.height)){
			this.setState({
				width: this.refs.wikiView.offsetWidth,
				height: this.refs.wikiView.offsetHeight
			});
		}
	}

	initQuill = () => {
		if(!this.props.currentWiki){
			return;
		}
		const options = {
			readOnly: true,
			theme: 'snow',
			"modules": {
				"toolbar": false
			}
		};
		this.editor = new Quill('#editor', options);
		if(this.props.currentWiki.content){
			this.editor.setContents(this.props.currentWiki.content);
		}
	};

	render(){
		if(!this.props.currentWiki){
			return (<div>No Wiki Selected</div>);
		}
		let coverImage = null;
		if (this.props.currentWiki.coverImage){
			coverImage = <div className='padding-md'>
				<ScaledImage width={this.state.width} height={this.state.height} src={`/api/chunks/data/${this.props.currentWiki.coverImage.chunks[0]._id}`}/>
			</div>;
		}
		let mapIcon = null;
		if (this.props.currentWiki.type === 'place' && this.props.currentWiki.mapImage){
			mapIcon = <ScaledImage width={this.state.width} height={this.state.height} src={`/api/chunks/data/${this.props.currentWiki.mapImage.icon.chunks[0]._id}`}/>
		}
		return (
			<div ref='wikiView' className='margin-md-top'>
				<h1>{this.props.currentWiki.name}</h1>
				<h2>{this.props.currentWiki.type}</h2>
				{coverImage}
				{mapIcon}
				<div className='padding-md'>
					<div id='editor'></div>
				</div>
				<div className='padding-md'>
					{this.props.currentWorld.canWrite ? <a href='#' onClick={() => {this.props.gotoPage('/ui/wiki/edit', {wiki: this.props.currentWiki._id})}}><Icon type="edit" theme="outlined" />Edit</a> : null}
				</div>
			</div>
		);
	}
}

export default WikiView;