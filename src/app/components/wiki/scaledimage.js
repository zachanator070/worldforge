
import React, {Component} from 'react';

class ScaledImage extends Component {

	constructor(props){
		super(props);
		this.state = {
			width: 0,
			height: 0
		};
	}

	onImgLoad = ({target:img}) => {
		const height = img.naturalHeight;
		const width = img.naturalWidth;
		const widthScale = this.props.width/width;
		const heightScale = this.props.height/height;
		let biggestScale = widthScale;
		if (heightScale > widthScale){
			biggestScale = heightScale;
		}
		if(biggestScale > 1){
			biggestScale = 1;
		}
		this.setState({
			width: width * biggestScale,
			height: height * biggestScale
		})
	};

	render(){
		return(
			<img alt='' style={{width: this.state.width, height: this.state.height}} onLoad={this.onImgLoad} src={this.props.src}/>
		);
	}
}

export default ScaledImage;