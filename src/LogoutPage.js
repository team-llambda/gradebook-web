import React, { Component } from 'react'
import { Logo } from './Components'
import gb from '@team-llambda/gradebook-api'

export default class LogoutPage extends Component {
	async componentDidMount() {
		window.localStorage.removeItem('EDUPointServices')
		window.location.href = '/'
	}

	render() {
		return (
			<div className="fullsize allcenter">
				<h1>logging you out...</h1>
				{/* <Logo /> */}
			</div>
		)
	}
}
