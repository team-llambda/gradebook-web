import React, { Component } from 'react'
import Menu from '../Components'

export default class ClassesPage extends Component {
	render() {
		return (
			<div className="fullsize">
				<Menu currentItemIndex={3} />
				<div className="content">
					<h1>Classes</h1>
				</div>
			</div>
		)
	}
}
