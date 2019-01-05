import React, {Component} from 'react';

class MouseCoordinates extends Component{
	constructor(props){
		super(props);
		this.state = {
			x: null,
			y: null,
		};
	}

	updateMouse = (mousemoveEvent) => {

		const boundingBox = this.refs.mouseMount.getBoundingClientRect();
		const x = mousemoveEvent.clientX - boundingBox.x;
		const y = mousemoveEvent.clientY - boundingBox.y;
		console.log(`x: ${x} y: ${y}`);
		this.setState({
			x: x,
			y: y
		});
	};

	render(){
		const children = React.Children.toArray(this.props.children);
		if(children.length !== 1){
			throw Error('Mouse Coordinates component must have 1 child');
		}

		const child = React.cloneElement(children[0], {mouseX: this.state.x, mouseY: this.state.y});

		return <div ref='mouseMount' onMouseMove={this.updateMouse} {...(this.props.style || {})} className={this.props.className}>
			{child}
		</div>
	}
}

export default MouseCoordinates;