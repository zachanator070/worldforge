import React, {Component} from 'react';

class MapCanvas extends Component {

	constructor(props){
		super(props);
		this.state = {
			windowWidth: 0,
			windowHeight: 0,
			lastMouseX: null,
			lastMouseY: null
		};
	}

	updateMapPosition = (evt) => {
		if(this.state.lastMouseX && this.state.lastMouseY){
			const newX = this.props.currentMap.x + (evt.clientX - this.state.lastMouseX);
			const newY = this.props.currentMap.y + (evt.clientY - this.state.lastMouseY);
			console.log(newX + ', ' + newY);
			this.props.setCurrentMapPosition(newX, newY);
		}
		this.setState({
			lastMouseX: evt.clientX,
			lastMouseY: evt.clientY
		});
	};

	componentDidMount(){
		// this.drawChunks();
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
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

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions = () => {
		this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
	};

	componentDidUpdate(){
	}

	drawChunks = () => {
		let context = this.refs.canvas.getContext('2d');
		for (let chunk of this.props.chunks){
			const part = new Image();
			part.onload = () => {
				const xOffset = this.props.currentMap.x * this.props.currentMap.zoom;
				const yOffset = this.props.currentMap.y * this.props.currentMap.zoom;
				context.drawImage(
					part,
					chunk.x * 250 * this.props.currentMap.zoom + xOffset,
					chunk.y * 250 * this.props.currentMap.zoom + yOffset,
					chunk.width * this.props.currentMap.zoom,
					chunk.height * this.props.currentMap.zoom
				);
			};
			part.src = `/api/chunks/data/${chunk._id}`;
		}
	};

	clip = (x, y, width, height) => {
		let clip = x > this.state.windowWidth;
		clip = clip || x + width < 0;
		clip = clip || y > this.state.windowHeight;
		clip = clip || y + height < 42;
		return clip;
	};

	render(){
		const images = [];
		const xOffset = this.props.currentMap.x * this.props.currentMap.zoom;
		const yOffset = this.props.currentMap.y * this.props.currentMap.zoom;
		for (let chunk of this.props.chunks){

			const x = chunk.x * 250 * this.props.currentMap.zoom + xOffset;
			const y = chunk.y * 250 * this.props.currentMap.zoom + yOffset;

			const width = chunk.width * this.props.currentMap.zoom;
			const height = chunk.height * this.props.currentMap.zoom;

			if(!this.clip(x, y, width, height)){
				images.push(
					<img
						src={`/api/chunks/data/${chunk._id}`}
						style={{position: 'absolute', left: x, top: y, width: width, height: height}}
						draggable="false"
						className='map-tile'
					/>
				);
			}

		}
		return (
			<div ref='canvas' className='margin-none' style={{width: this.state.windowWidth, height: this.state.windowHeight - 50}}>
				{images}
			</div>
		);
	}

}

export default MapCanvas;