import React, {Component} from 'react';
import GameActionFactory from "../../redux/actions/gameactionfactory";

class MapDrawingCanvas extends Component{

	constructor(props){
		super(props);
		this.state = {
			mousex: 0,
			mousey: 0
		}
	}

	render(){
		if(!this.props.brushOptions){
			return (<div></div>);
		}
		let style = {
			width: this.props.brushOptions.size,
			height: this.props.brushOptions.size,
			position: "absolute",
			left: this.state.mousex + this.props.brushOptions.size / 2,
			top: this.state.mousey + this.props.brushOptions.size / 2,
		};
		if(this.props.brushOptions.type.filled){
			style.backgroundColor = this.props.brushOptions.color;
		}
		else{
			style.borderStyle = 'solid';
			style.borderWidth = 'thick';
			style.borderColor = this.props.brushOptions.color;
		}
		if(this.props.brushOptions.type === GameActionFactory.BRUSH_CIRCLE){
			style.borderRadius = this.props.brushOptions.size;
		}
		if(this.props.brushOptions.type === GameActionFactory.BRUSH_ERASER){
			style.backgroundColor = 'white';
		}
		return(
			<div>
				<canvas
					ref='canvas'
					style={{
						width: this.props.width,
						height: this.props.height,
						position: 'absolute',
						left: this.props.left,
						right: this.props.right
					}}
					onMouseOver={(e) => {this.setState({mousex: e.clientX, mousey: e.clientY})}}
				>
				</canvas>
				{this.props.brushOptions.on === GameActionFactory.BRUSH_ON ?
					<div style={style}></div>
					:
					null
				}
			</div>
		);
	}
}

export default MapDrawingCanvas;