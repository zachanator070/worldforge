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

		let smallestRatio = this.props.width / this.props.currentMap.image.width;
		if(this.props.height / this.props.currentMap.image.height < smallestRatio){
			smallestRatio = this.props.height / this.props.currentMap.image.height;
		}
		this.props.setCurrentMapZoom(smallestRatio);
		this.props.setCurrentMapPosition(-this.props.currentMap.image.width/2, -this.props.currentMap.image.height/2);
	}

	clip = (x, y, width, height) => {
		let clip = x > this.props.width;
		clip = clip || x + width < 0;
		clip = clip || y > this.props.height;
		clip = clip || y + height < 0;
		return clip;
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

	render(){
		const images = [];

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

			images.push(
				<img
					key={chunk._id}
					src={`/api/chunks/data/${chunk._id}`}
					style={{position: 'absolute', left: x, top: y, width: width, height: height}}
					draggable="false"
					className='map-tile'
				/>
			);

		}

		for (let pin of this.props.currentMap.pins){

			const coordinates = this.translate(pin.x, pin.y);
			const x = coordinates[0];
			const y = coordinates[1];

			const editButton = this.props.currentWorld && this.props.currentWorld.canWrite ?
				<a href='#' className='margin-md-left' onClick={() => {
					this.props.setPinBeingEdited(pin);
					this.props.showEditPinModal(true);
				}}>Edit Pin</a>
				: null;

			let pinPopupContent = <div>
				<h2>Empty Pin</h2>
				{editButton}
			</div>;

			if(pin.page){
				pinPopupContent = <div>
					<h2>{pin.page.name}</h2>
					<h3>{pin.page.type}</h3>
					<a href='#' onClick={() => {
						this.props.findAndSetDisplayWiki(pin.page._id);
						this.props.showDrawer(true);
					}}>Details</a>
					{pin.page.type === 'place' && pin.page.mapImage ? <a className='margin-md-left' href='#' onClick={() => {this.props.gotoPage('/ui/map', {map: pin.page.mapImage})}}>Open Map</a> : null }
					{editButton}
				</div>;
			}

			images.push(
				<Popover
					content={pinPopupContent}
					trigger="click"
					key={pin._id}
					overlayStyle={{zIndex: '1'}}
				>
					<Icon
						type="pushpin"
						style={{position: 'absolute', left: x, top: y - 50, fontSize: '50px', zIndex:3, color:'red'}}
						theme='filled'
						draggable="false"
					/>
				</Popover>

			);

		}

		let canvas =
			<div
				ref='canvas'
				className='margin-none overflow-hidden'
				style={{width: this.props.width, height: this.props.height}}
				onWheel={this.handleWheelEvent}
			>
				{images}
			</div>;
		if(this.props.currentWorld && this.props.currentWorld.canWrite){
			canvas = <Dropdown
				overlay={
					<Menu >
						<Menu.Item key='new pin' onClick={() => {
							let pin = {
								x: (this.state.lastMouseX - this.props.width / 2 ) / this.props.currentMap.zoom - this.props.currentMap.x,
								y: (this.state.lastMouseY - 42 - this.props.height / 2 ) / this.props.currentMap.zoom - this.props.currentMap.y,
								world: this.props.currentWorld._id,
								map: this.props.currentMap.image._id
							};
							this.props.createPin(pin);
						}}>New Pin</Menu.Item>
					</Menu>
				}
				trigger={['contextMenu']}
			>
				{canvas}
			</Dropdown>;
		}
		return canvas;
	}

}

export default MapCanvas;