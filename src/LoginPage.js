import React, { Component } from 'react'
import { Button, Logo, Textbox } from './Components'
import gb from '@team-llambda/gradebook-api'

export default class LoginPage extends Component {
	constructor(props) {
		super(props)

		//TODO: call reauth route to see if already authenticated

		this.usernameTextbox = React.createRef()
		this.passwordTextbox = React.createRef()
	}

	login = async () => {
		let username = this.usernameTextbox.current.getText()
		let password = this.passwordTextbox.current.getText()
		console.log('LOGIN CALLED')
		let res = await gb.login(username, password)
	}

	render() {
		return (
			<div className="cover fullsize allcenter">
				<img
					alt="logo"
					style={{ height: '4em', marginBottom: '1em' }}
					src="../assets/logo.svg"
				/>
				<Textbox hint="username" ref={this.usernameTextbox} />
				<Textbox hint="password" type="password" ref={this.passwordTextbox} />
				<Button text="login" triggerLoadOnClick={true} onClick={this.login} />
				<Logo />
			</div>
		)
	}
}
