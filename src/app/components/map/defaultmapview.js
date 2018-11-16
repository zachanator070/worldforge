
import React, {Component} from 'react';
import {Button, Icon, Spin, Upload} from "antd";

class DefaultMapView extends Component{

	constructor(props){
		super(props);
		this.state = {
			mapToUpload: null,
			mapImageList: [],
		};
	}

	setMapToUpload = (file) => {
		this.setState({
			mapToUpload: file
		});
		return false;
	};

	setMapImageList = (files) => {
		this.setState({
			mapImageList: files.fileList.length > 0 ? [files.fileList[files.fileList.length - 1]] : []
		});
		if (files.fileList.length === 0){
			this.setState({
				mapToUpload: null
			});
		}
	};

	upload = () => {
		this.props.setMapUploadStatus('loading');
		this.props.uploadImageFromMap(this.state.mapToUpload);
	};

	render(){
		let uploadButton = null;
		if (this.state.mapToUpload){
			uploadButton = <Button onClick={this.upload}>
				Upload
			</Button>;
		}
		return (
			<div className='padding-lg text-align-center'>
				{this.props.ui.mapUploadStatus === 'loading' ?
					<div>
						<Spin indicator={<Icon type="loading" style={{ fontSize: 24 , marginRight: '15px'}} spin />} />
						<span>Uploading...</span>
					</div>
				:
					<div>
						<div className='padding-lg'>
							Map Image does not exist
						</div>
						<div className='map-upload'>
							<Upload
							action="/api/images"
							beforeUpload={this.setMapToUpload}
							multiple={false}
							listType={'picture'}
							coverImage={this.state.mapToUpload}
							fileList={this.state.mapImageList}
							className='upload-list-inline'
							onChange={this.setMapImageList}
							>
								<Button>
									<Icon type="upload" /> Select Map
								</Button>
							</Upload>
						</div>
						{uploadButton}
					</div>
				}
			</div>
		);
	}
}

export default DefaultMapView;