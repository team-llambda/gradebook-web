import React, { Component } from 'react'
import { Menu, Logo } from './Components'

export default class SettingsPage extends Component {
	render() {
		return (
			<div className="fullsize">
				<Menu currentItemIndex={2} />
				<div className="content">
					<h1>Settings</h1>
				</div>
				<Logo />
			</div>
		)
	}
}
