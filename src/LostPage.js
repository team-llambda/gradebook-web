import React, { Component } from 'react'
import { Logo } from './Components'

export default class LostPage extends Component {
	render() {
		return (
			<div className="fullsize allcenter">
				<h1>404 not found...</h1>
				<h2>well, you must be lost :)</h2>
				<Logo />
			</div>
		)
	}
}
