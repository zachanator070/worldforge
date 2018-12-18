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
		if(this.props.currentWiki.content){
			this.editor = new Quill('#viewer', options);
			this.editor.setContents(this.props.currentWiki.content);
		}
	};

	getPinFromPageId = (pageId) => {
		for(let pin of this.props.allPins){
			if(pin.page && pin.page._id === pageId){
				return pin;
			}
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
			mapIcon = <div>
				<ScaledImage width={this.state.width} height={this.state.height} src={`/api/chunks/data/${this.props.currentWiki.mapImage.icon.chunks[0]._id}`}/>
				<span className='margin-md-left'>
					<a href='#' onClick={() => {this.props.gotoPage('/ui/map', {map: this.props.currentWiki.mapImage._id});}}>
						Go to Map <Icon type="export" />
					</a>
				</span>
			</div>;
		}

		let gotoMap = null;
		let pin = this.getPinFromPageId(this.props.currentWiki._id);
		if(pin){
			gotoMap = <a href='#' onClick={() => {this.props.gotoPage('/ui/map', {map: pin.map._id});}}>
				See on map <Icon type="export" />
			</a>;
		}

		return (
			<div ref='wikiView' className='margin-md-top'>
				{coverImage}
				<h1>{this.props.currentWiki.name}</h1>
				{gotoMap}
				<h2>{this.props.currentWiki.type}</h2>
				{mapIcon}
				{this.props.currentWiki.content ?
					<div className='padding-md'>
						<div id='viewer'></div>
					</div>
					:
					null
				}
				<div className='padding-md'>
					{this.props.currentWorld.canWrite ?
						<a href='#' onClick={() => {this.props.gotoPage('/ui/wiki/edit', {wiki: this.props.currentWiki._id})}}>
							<Icon type="edit" theme="outlined" />Edit
						</a>
						:
						null
					}
				</div>
			</div>
		);
	}
}

export default WikiView;