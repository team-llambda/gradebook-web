import React, { Component } from 'react'
import { Button, Logo, Textbox } from './Components'

export default class LoginPage extends Component {
	constructor(props) {
		super(props)

		//TODO: call reauth route to see if already authenticated
	}

	render() {
		return (
			<div className="cover fullsize allcenter">
				<img
					alt="logo"
					style={{ height: '4em', marginBottom: '1em' }}
					src="../assets/logo.svg"
				/>
				<Textbox hint="username" />
				<Textbox hint="password" type="password" />
				<Button text="login" triggerLoadOnClick={true} />
				<Logo />
			</div>
		)
	}
}
