import React, { Component } from 'react'
import Menu from '../Components'

export default class SingleClassPage extends Component {
	render() {
		return (
			<div className="fullsize">
				<Menu currentItemIndex={0} />
				<div className="content">
					<h1>Classes</h1>
				</div>
				<Logo />
			</div>
		)
	}
}
