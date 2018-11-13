import React, {Component} from 'react';
import {Button, Icon, Input, Select, Upload} from "antd";

class WikiEdit extends Component{

	constructor(props){
		super(props);
		this.editor = null;
		this.state = {
			mapToUpload: false,
			coverToUpload: false,
			name: props.currentWiki ? props.currentWiki.name : null,
			type: props.currentWiki ? props.currentWiki.type : null,
			coverImageList: [],
			mapImageList: [],
			saving: false
		}
	}

	loadCoverImageList = () => {
		this.setState({
			coverImageList: this.props.currentWiki.coverImage ? [{
				uid: '-1',
				url: `/api/chunks/data/${this.props.currentWiki.coverImage.chunks[0]._id}`,
				name: this.props.currentWiki.coverImage.name
			}] : []
		});
	};

	setCoverImageList = (files) => {
		this.setState({
			coverImageList: files.fileList.length > 0 ? [files.fileList[files.fileList.length - 1]] : []
		});
		if (files.fileList.length === 0){
			this.setState({
				coverToUpload: null
			});
		}
	};

	setMapImageList = (files) => {
		this.setState({
			mapImageList: files.fileList.length > 0 ? [files.fileList[files.fileList.length - 1]] : []
		});
		if (files.fileList.length === 0){
			this.setState({
				mapToUpload: null
			});
		}
	};

	loadMapImageList = () => {
		this.setState({
			mapImageList: this.props.currentWiki.mapImage ? [{
				uid: '-1',
				url: `/api/chunks/data/${this.props.currentWiki.mapImage.chunks[0]._id}`,
				name: this.props.currentWiki.mapImage.name
			}] : []
		});
	};

	componentDidMount(){
		if(!this.props.currentWiki){
			return;
		}
		const options = {
			theme: 'snow',
			modules: {
				toolbar: [
					[{ header: [1, 2, false] }],
					['bold', 'italic', 'underline'],
					['image', 'code-block']
				]
			},
			placeholder: 'Compose an epic...',
		};
		this.editor = new Quill('#editor', options);
		if(this.props.currentWiki.content){
			this.editor.setContents(this.props.currentWiki.content);
		}
		this.loadCoverImageList();
		this.loadMapImageList();
	}

	save = () => {
		this.props.saveWiki(
			this.state.name,
			this.state.type,
			this.state.coverToUpload,
			this.state.mapToUpload,
			this.editor.getContents()
		);
	};

	setMapToUpload = (file) => {
		this.setState({
			mapToUpload: file
		});
		return false;
	};

	setCoverToUpload = (file) => {
		this.setState({
			coverToUpload: file
		});
		return false;
	};

	setType = (value) => {
		this.setState({
			type: value
		});
	};

	setName = (value) => {
		this.setState({
			name: value.target.value
		});
	};

	render(){
		if(!this.props.currentWiki){
			return (<div></div>);
		}

		const wikiTypes = ['person', 'place', 'item', 'ability', 'spell', 'article', 'monster'];
		const options = [];
		for(let type of wikiTypes){
			options.push(<Select.Option key={type} value={type}>{type}</Select.Option>);
		}

		let coverRevert = null;
		if(this.state.coverToUpload !== false){
			coverRevert = <Button onClick={() => {this.setCoverToUpload(false); this.loadCoverImageList();}}>Revert</Button>;
		}

		let mapRevert = null;
		if(this.state.mapToUpload !== false){
			mapRevert = <Button onClick={() => {this.setMapToUpload(false); this.loadMapImageList();}}>Revert</Button>;
		}

		return (
			<div>
				<div className='margin-lg'>
					Article Name: <Input placeholder="Article Name" style={{ width: 120 }} value={this.state.name} onChange={this.setName}/>
				</div>
				<div className='margin-lg'>
					Type: <Select defaultValue={this.props.currentWiki.type} style={{ width: 120 }} onChange={this.setType}>
						{options}
					</Select>
				</div>
				<div className='margin-lg'>
					<Upload
						action="/api/images"
						beforeUpload={this.setCoverToUpload}
						multiple={false}
						listType={'picture'}
						coverImage={this.state.coverToUpload}
						fileList={this.state.coverImageList}
						className='upload-list-inline'
						onChange={this.setCoverImageList}
					>
						<Button>
							<Icon type="upload" /> Select Cover Image
						</Button>
					</Upload>
					{coverRevert}
				</div>
				<div className='margin-lg'>
					<Upload
						action="/api/images"
						beforeUpload={this.setMapToUpload}
						multiple={false}
						listType={'picture'}
						coverImage={this.state.mapToUpload}
						fileList={this.state.mapImageList}
						className='upload-list-inline'
						onChange={this.setMapImageList}
					>
						<Button>
							<Icon type="upload" /> Select Map Image
						</Button>
					</Upload>
					{mapRevert}
				</div>
				<div className='margin-lg'>
					<div id="editor"></div>
				</div>

				<Button type='primary' disabled={this.state.saving} onClick={this.save}>Save</Button>
				<Button type='danger' onClick={() => {this.props.gotoPage('/ui/wiki/view')}}>Discard</Button>
			</div>
		);
	}
}

export default WikiEdit;