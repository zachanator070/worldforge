import React, {Component} from 'react';
import * as mathjs from 'mathjs';

class MapCanvas extends Component {

	constructor(props){
		super(props);
		this.state = {
			lastMouseX: null,
			lastMouseY: null
		};
	}

	updateMapPosition = (evt) => {
		if(this.state.lastMouseX && this.state.lastMouseY){
			const newX = this.props.currentMap.x + (evt.clientX - this.state.lastMouseX);
			const newY = this.props.currentMap.y + (evt.clientY - this.state.lastMouseY);
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
			canvas.addEventListener('mousemove', this.updateMapPosition, false);
		}, false);
		canvas.addEventListener('mouseup', (mouseUpEvent) => {
			canvas.removeEventListener('mousemove', this.updateMapPosition);
			this.setState({
				lastMouseX: null,
				lastMouseY: null
			});
		}, false);
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
		this.props.setCurrentMapZoom(newZoom);

		let deltaX = this.props.currentMap.image.width * zoomRate / 2;
		let deltaY = this.props.currentMap.image.height * zoomRate / 2;

		this.props.setCurrentMapPosition(
			this.props.currentMap.x - deltaX,
			this.props.currentMap.y - deltaY,
		);

	};

	getCameraCoords = (x, y) => {

		const worldCordinates = mathjs.matrix([[x], [y], [0], [1]]);
		const distance = 100 * this.props.currentMap.zoom;

		// world coordinates * view = camera coordinates
		const viewMatrix = mathjs.matrix([
			[1, 0, 0, -this.props.currentMap.x],
			[0, 1, 0, -this.props.currentMap.y],
			[0, 0, 1, -distance],
			[0, 0, 0, 1],
		]);

		const left = 0 - this.props.width/2;
		const right = this.props.width/2;
		const top =  this.props.height/2;
		const bottom = 0 - this.props.height/2;
		const near = 0;
		const far = 0 - distance;

		const projectionMatrix = mathjs.matrix([
			[2/(right - left), 0 ,0 , -(right + left)/(right - left)],
			[0, 2/(top - bottom) , 0 , -(top + bottom)/(top - bottom)],
			[0, 0,  -2/(far - near), -(far + near)/(far - near)],
			[0, 0, 0, 1]
		]);

		return mathjs.multiply(projectionMatrix, mathjs.multiply(viewMatrix, worldCordinates));
	};

	render(){
		const images = [];

		for (let chunk of this.props.chunks){

			const x = chunk.x * 250 * this.props.currentMap.zoom + this.props.currentMap.x;
			const y = chunk.y * 250 * this.props.currentMap.zoom + this.props.currentMap.y;

			const width = chunk.width * this.props.currentMap.zoom;
			const height = chunk.height * this.props.currentMap.zoom;

			// const cameraCoordinates = this.getCameraCoords(chunk.x * 250, chunk.y * 250);

			// const x = cameraCoordinates.subset(mathjs.index(0,0)) * this.props.width;
			// const y = cameraCoordinates.subset(mathjs.index(1,0)) * this.props.height;

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
		return (
			<div ref='canvas' className='margin-none overflow-hidden' style={{width: this.props.width, height: this.props.height}} onWheel={this.handleWheelEvent}>
				{images}
			</div>
		);
	}

}

export default MapCanvas;