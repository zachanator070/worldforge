import React, {Component} from 'react';
import {ChromePicker} from 'react-color';
import GameActionFactory from "../../redux/actions/gameactionfactory";
import {FiCircle, FiSquare} from "react-icons/fi";
import {FaEraser} from "react-icons/fa";
import {Radio, Slider, Switch} from 'antd';

class BrushOptions extends Component {
	render(){
		return (
			<div>
				<Radio.Group defaultValue={this.props.currentGame.brushOptions.type} onChange={(e) => {
					this.props.setBrushOptions({type: e.target.value});
				}}>
					<Radio.Button value={GameActionFactory.BRUSH_CIRCLE}><FiCircle /></Radio.Button>
					<Radio.Button value={GameActionFactory.BRUSH_BOX}><FiSquare/></Radio.Button>
					<Radio.Button value={GameActionFactory.BRUSH_ERASER}><FaEraser/></Radio.Button>
				</Radio.Group>
				<Slider
					className="margin-md"
					min={1}
					max={100}
					onChange={(value) => {this.props.setBrushOptions({size: value})}}
					value={this.props.currentGame.brushOptions.size}
				/>
				<div className='margin-lg'>
					<label className='margin-md-right'>Filled</label><Switch defaultChecked onChange={(checked) => {this.props.setBrushOptions({filled: checked})}} />
				</div>
				<ChromePicker
					className="margin-lg"
					color={this.props.currentGame.brushOptions.color}
					onChangeComplete={(color, event) => {
						this.props.setBrushOptions({
							color: color.rgb
						})
					}}
				/>
			</div>
		)
	}
}

export default BrushOptions;