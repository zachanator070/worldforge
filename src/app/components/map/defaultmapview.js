
import React, {Component} from 'react';
import {Button, Icon, Upload} from "antd";

class DefaultMapView extends Component{

	constructor(props){
		super(props);
		this.state = {
			mapToUpload: null,
		};
	}

	beforeUpload = (file) => {
		this.setState({
			mapToUpload: file
		});
		return false;
	};

	upload = () => {
		this.props.uploadImageFromMap(this.state.mapToUpload);
	};

	render(){
		return (
			<div className='padding-lg text-align-center'>
				<div className='padding-lg'>
					Map Image does not exist
				</div>
				<div className='padding-lg'>
					<Upload
						action="/api/images"
						beforeUpload={this.beforeUpload}
						multiple={false}
						showUploadList={true}
						fileList={this.state.mapToUpload ? [this.state.mapToUpload] : []}
						className='inline-block'
					>
						<Button>
							<Icon type="upload" /> Select Map
						</Button>
					</Upload>
				</div>
				{this.state.mapToUpload ? <Button onClick={this.upload}>
					Upload
				</Button> : null}
			</div>
		);
	}
}

export default DefaultMapView;