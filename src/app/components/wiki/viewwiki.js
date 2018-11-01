
import React, {Component} from 'react';
import Quill from "quill";

class ViewWiki extends Component {

	render(){
		const options = {
			debug: 'info',
			modules: {
				toolbar: '#toolbar'
			},
			placeholder: 'Compose an epic...',
			readOnly: true,
			theme: 'snow'
		};
		const editor = new Quill('#editor', options);
		return (
			<div id='editor'></div>
		);
	}
}