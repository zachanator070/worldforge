import React, {Component} from 'react';
import {Dropdown, Icon, Menu, Popover} from "antd";

class MapCanvas extends Component {

	constructor(props){
		super(props);
		this.state = {
			lastMouseX: null,
			lastMouseY: null,
		};
	}

	updateMapPosition = (evt) => {
		if(this.state.lastMouseX && this.state.lastMouseY){
			let newX = this.props.currentMap.x + (evt.clientX - this.state.lastMouseX) / this.props.currentMap.zoom;
			let newY = this.props.currentMap.y + (evt.clientY - this.state.lastMouseY) / this.props.currentMap.zoom;
			this.props.setCurrentMapPosition(newX, newY);
		}
		this.setState({
			lastMouseX: evt.clientX,
			lastMouseY: evt.clientY
		});
	};

	componentDidMount(){
		const canvas = this.refs.canvas;
		canvas.addEventListener('mousedown', (mousedownEvent) => {
			this.setState({
				lastMouseX: mousedownEvent.clientX,
				lastMouseY: mousedownEvent.clientY
			});
			canvas.addEventListener('mousemove', this.updateMapPosition, false);
		}, false);
		canvas.addEventListener('mouseup', (mouseUpEvent) => {
			canvas.removeEventListener('mousemove', this.updateMapPosition);
		}, false);

		this.calcDefaultPosition();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if(this.props.currentMap.zoom === 0 || prevProps.currentMap.image._id !== this.props.currentMap.image._id){
			this.calcDefaultPosition();
		}
	}

	calcDefaultPosition = () => {
		let smallestRatio = this.props.width / this.props.currentMap.image.width;
		if(this.props.height / this.props.currentMap.image.height < smallestRatio){
			smallestRatio = this.props.height / this.props.currentMap.image.height;
		}
		this.props.setCurrentMapZoom(smallestRatio);
		this.props.setCurrentMapPosition(-this.props.currentMap.image.width/2, -this.props.currentMap.image.height/2);
	};

	handleWheelEvent = (event) => {
		let zoomRate = .1;
		if(event.deltaY > 0){
			zoomRate *= -1;
		}
		const newZoom = this.props.currentMap.zoom + zoomRate;
		if(newZoom < 2 && newZoom > 0){
			this.props.setCurrentMapZoom(newZoom);
		}

	};

	translate = (x, y) => {

		x += this.props.currentMap.x;
		y += this.props.currentMap.y;

		x *= this.props.currentMap.zoom;
		y *= this.props.currentMap.zoom;

		x += this.props.width / 2;
		y += this.props.height / 2;

		x = Math.floor(x);
		y = Math.floor(y);

		return [x, y];

	};

	getChunks = () => {
		let chunks = [];
		for (let chunk of this.props.currentMap.chunks){

			const coordinates = this.translate(chunk.x * 250, chunk.y * 250);
			const x = coordinates[0];
			const y = coordinates[1];

			let width = chunk.width;
			width *= this.props.currentMap.zoom;
			width = Math.ceil(width);

			let height = chunk.height;
			height *= this.props.currentMap.zoom;
			height = Math.ceil(height);

			chunks.push(
				<img
					key={chunk._id}
					src={`/api/chunks/data/${chunk._id}`}
					style={{position: 'absolute', left: x, top: y, width: width, height: height}}
					draggable="false"
					className='map-tile'
				/>
			);
		}
		return chunks;
	};

	getDropdownMenu = () => {
		const menuItems = [];
		for(let item of this.props.menuItems){
			menuItems.push(
				<Menu.Item key={item.name} onClick={() => {
					item.onClick(this.state.lastMouseX, this.state.lastMouseY);
				}}>{item.name}</Menu.Item>
			);
		}

		return menuItems;
	};

	render(){
		if(!this.props.currentMap){
			return <div>No Current Map</div>;
		}
		if(!this.props.currentWorld){
			return <div>No Current World</div>;
		}
		let images = this.getChunks();

		const extras = [];

		for(let extra of this.props.extras){
			const coords = this.translate(extra.x, extra.y);
			extras.push(
				extra.render(coords[0], coords[1])
			);
		}

		images = images.concat(extras);

		let canvas =
			<div
				ref='canvas'
				className='margin-none overflow-hidden'
				style={{width: this.props.width, height: this.props.height}}
				onWheel={this.handleWheelEvent}
			>
				{images}
			</div>;

		if(this.props.currentWorld.canWrite){

			const menuItems = this.getDropdownMenu();

			if(menuItems.length > 0){
				canvas = <Dropdown
					overlay={
						<Menu>
							{menuItems}
						</Menu>
					}
					trigger={['contextMenu']}
				>
					{canvas}
				</Dropdown>;
			}
		}
		return canvas;
	}

}

export default MapCanvas;