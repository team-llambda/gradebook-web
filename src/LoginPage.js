import React, { Component } from 'react'
import { Button, Logo, Textbox } from './Components'
import gb from '@team-llambda/gradebook-api'

export default class LoginPage extends Component {
	constructor(props) {
		super(props)

		this.usernameTextbox = React.createRef()
		this.passwordTextbox = React.createRef()
	}

	login = async () => {
		let username = this.usernameTextbox.current.getText()
		let password = this.passwordTextbox.current.getText()

		let res = await gb.login(username, password)

		if (res.status === 200) {
			window.location.href = '/classes'
		} else {
			// TODO: show error message on login fail
		}
	}

	render() {
		return (
			<div className="cover fullsize allcenter">
				<img
					alt="logo"
					style={{ height: '4em', marginBottom: '1em' }}
					src="../assets/logo.svg"
				/>
				<Textbox
					hint="username"
					ref={this.usernameTextbox}
					onEnter={this.login}
				/>
				<Textbox
					hint="password"
					type="password"
					ref={this.passwordTextbox}
					onEnter={this.login}
				/>
				<Button text="login" triggerLoadOnClick={true} onClick={this.login} />
				<Logo />
			</div>
		)
	}
}
