import React, {Component} from 'react';
import {Dropdown, Icon, Menu} from "antd";

class FolderView extends Component {

	constructor(props){
		super(props);
		this.state = {
			selected: null,
			opened: [],
			editing: null,
			newName: null
		}
	}

	componentDidUpdate(){
		if(this.refs.editing){
			this.refs.editing.focus();
		}
	}

	openFolder = (folderId) => {
		// if we are opened already, remove from list
		if(this.state.opened.includes(folderId)){
			let copy = this.state.opened.slice();
			copy.splice(copy.indexOf(folderId), 1);
			this.setState({
				opened: copy
			});
		}
		else{
			// otherwise if we aren't opened, add to list
			this.setState({
				opened: this.state.opened.concat(folderId)
			});
		}
	};

	findPage = (folder, wikiId, path) => {
		if(folder.pages.filter((page) => { return page._id === wikiId; }).length > 0){
			return path.concat([folder._id]);
		}

		for (let child of folder.children){
			let childResults = this.findPage(child, wikiId, path.concat([folder]));
			if(childResults.length > 0){
				return childResults;
			}
		}

		return [];
	};

	renderPage = (page, indent) => {
		const style = {'marginLeft': 5 * indent + 5 + 'px'};
		let className = '';
		if (page._id === this.props.currentWiki ? this.props.currentWiki._id : null){
			className = 'highlighted';
		}
		return (
			<div key={page._id}>
				<a
					href='#'
					className={className}
					onClick={
						() => {this.props.gotoPage('/ui/wiki/view', {wiki: page._id})}
					}
					style={style}
				>
					<Icon type="file-text" theme="outlined" /> {page.name}
				</a>
			</div>
		);
	};

	setEditing = (folder) => {
		if(folder){
			this.setState({
				editing: folder._id,
				newName: folder.name
			});
		}
		else {
			this.setState({
				editing: null,
				newName: null
			});
		}
	};

	stopEditing = (event) => {
		if (event.key === 'Enter'){
			this.props.updateFolder({_id: this.state.editing, name: this.state.newName});
			this.setEditing(null);
		}
		if(event.key === 'Esc'){
			this.setEditing(null);
		}
	};

	setNewName = (event) => {
		this.setState({
			newName: event.target.value
		});
	};

	createFolder = (parent) => {
		this.props.createFolder(parent, {name: 'New Folder'});
		if(!this.state.opened.includes(parent._id)){
			this.openFolder(parent._id);
		}
	};

	renderFolder = (currentPagePath, folder, indent) => {
		const menu = <Menu>
			<Menu.Item key='new page' onClick={() => {this.props.createWiki('New Page', 'article', folder)}}>New Page</Menu.Item>
			<Menu.Item key='new folder' onClick={() => {this.createFolder(folder)}}>New Folder</Menu.Item>
			<Menu.Item key='rename' onClick={() => {this.setEditing(folder)}}>Rename</Menu.Item>
			<Menu.Item key='delete' onClick={() => {this.props.deleteFolder(folder)}}>Delete</Menu.Item>
		</Menu>;
		let icon = <Icon type="folder" theme="outlined" />;
		const children = [];
		const pages = [];
		// if we are opened, populate children folders and pages then change icon
		if(this.state.opened.includes(folder._id) || currentPagePath.includes(folder._id)){
			icon = <Icon type="folder-open" theme="outlined" />;
			for (let otherFolder of folder.children){
				children.push(this.renderFolder(currentPagePath, otherFolder, indent + 1));
			}
			for (let page of folder.pages){

				pages.push(this.renderPage(page, indent));
			}
		}

		let folderItem = (
			<a href='#' style={{'marginLeft': 5 * indent + 'px'}} onClick={() => {this.openFolder(folder._id)}}>
					<span>
						{icon} {folder.name}
					</span>
			</a>
		);

		if(this.props.currentWorld.canWrite){
			folderItem = (
				<Dropdown overlay={menu} trigger={['contextMenu']}>
					{folderItem}
				</Dropdown>
			);
		}

		if (folder._id === this.state.editing){
			folderItem = (
				<span  style={{'marginLeft': 5 * indent + 'px'}}>
					{icon} <input type='text' ref='editing' onBlur={() => {this.setEditing(null)}} onChange={this.setNewName} onKeyDown={this.stopEditing} value={this.state.newName}/>
				</span>
			);
		}

		return (
			<div key={folder._id}>
				{folderItem}
				{children}
				{pages}
			</div>
		);
	};

	render(){
		const currentPagePath = this.findPage(this.props.currentWorld.rootFolder, this.props.currentWiki ? this.props.currentWiki._id : null, []);
		const toRender = [];
		for (let folder of this.props.currentWorld.rootFolder.children){
			toRender.push(this.renderFolder(currentPagePath, folder, 0));
		}
		const pages = [];
		for (let page of this.props.currentWorld.rootFolder.pages){
			pages.push(this.renderPage(page, 0))
		}
		return (
			<div className='margin-md'>
				{toRender}
				{pages}
			</div>
		);

	}
}

export default FolderView;