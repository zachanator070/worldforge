import React, {Component} from 'react';
import GameActionFactory from "../../redux/actions/gameactionfactory";

class MapDrawingCanvas extends Component{

	constructor(props){
		super(props);
		this.state = {
			mousex: 0,
			mousey: 0,
			mouseOnCanvas: false
		}
	}

	startDrawing = () => {
		if(this.refs.brush){
			this.refs.brush.addEventListener('mousemove', this.draw, false);
		}
	};

	stopDrawing = () => {
		if(this.refs.brush){
			this.refs.brush.removeEventListener('mousemove', this.draw, false);
		}
	};

	draw = () => {

	};

	render(){
		if(!this.props.brushOptions){
			return (<div></div>);
		}
		let style = {
			width: this.props.brushOptions.size,
			height: this.props.brushOptions.size,
			position: "absolute",
			display: "block",
			left: this.state.mousex - this.props.brushOptions.size / 2,
			top: this.state.mousey - this.props.brushOptions.size / 2,
		};
		const colorObj = this.props.brushOptions.color;
		const color = `rgba(${colorObj.r}, ${colorObj.g}, ${colorObj.b}, ${colorObj.a})`;
		if(this.props.brushOptions.filled || this.props.brushOptions.type === GameActionFactory.BRUSH_ERASER){
			style.backgroundColor = color;
		}
		else{
			style.borderStyle = 'solid';
			style.borderWidth = 'thick';
			style.borderColor = color;
		}
		if(this.props.brushOptions.type === GameActionFactory.BRUSH_CIRCLE){
			style.borderRadius = this.props.brushOptions.size;
		}
		if(this.props.brushOptions.type === GameActionFactory.BRUSH_ERASER){
			style.backgroundColor = 'white';
		}
		const coordinates = this.props.translate(0,0);
		const dimensions = this.props.translate(this.props.currentMap.image.width, this.props.currentMap.image.height);
		return(
			<div ref='canvasContainer' className='flex-grow-1' style={{zIndex: 1}}>
				{this.props.brushOptions.on === GameActionFactory.BRUSH_ON && this.state.mouseOnCanvas ?
					<div
						ref='brush'
						style={style}
						onMouseDown={this.startDrawing}
						onMouseUp={this.stopDrawing}
					/>
					:
					null
				}
				<canvas
					ref='canvas'
					style={{
						width: dimensions[0] - coordinates[0],
						height: dimensions[1] - coordinates[1],
						position: 'absolute',
						left: coordinates[0],
						top: coordinates[1],
					}}
					onMouseMove={(e) => {
						if(this.refs.canvasContainer){
							const boundingBox = this.refs.canvasContainer.getBoundingClientRect();
							this.setState({mousex: e.clientX - boundingBox.x, mousey: e.clientY - boundingBox.y})
						}
					}}
					onMouseEnter={(e) => {
						this.setState({mouseOnCanvas: true});
					}}
					onMouseLeave={(e) => {
						this.setState({mouseOnCanvas: false});
					}}
				>
				</canvas>
			</div>
		);
	}
}

export default MapDrawingCanvas;