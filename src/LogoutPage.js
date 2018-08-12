import React, { Component } from 'react'
import { Logo } from './Components'

export default class LogoutPage extends Component {
	async componentDidMount() {
		// TODO: actually perform the logout
		// const response = await logout()
		window.location.href = '/'
	}

	render() {
		return (
			<div className="fullsize allcenter">
				<h1>logging you out...</h1>
				<Logo />
			</div>
		)
	}
}
