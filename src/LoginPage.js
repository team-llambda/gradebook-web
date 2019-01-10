import React, { Component } from 'react'
import { Button, Logo, Textbox } from './Components'
import gb from '@team-llambda/gradebook-api'
import { NotificationContainer, NotificationManager } from 'react-notifications'

export default class LoginPage extends Component {
	constructor(props) {
		super(props)

		this.usernameTextbox = React.createRef()
		this.passwordTextbox = React.createRef()
		this.loginButton = React.createRef()
	}

	login = async () => {
		this.loginButton.current.setLoading(true)
		let username = this.usernameTextbox.current.getText()
		let password = this.passwordTextbox.current.getText()

		let res = await gb.login(username, password)

		switch (res.status) {
			case 200:
				window.location.href = '/classes'
				break
			case 401:
				NotificationManager.error('Username or password incorrect')
				break
			default:
				NotificationManager.error('Something went wrong :(')
		}
		this.loginButton.current.setLoading(false)
	}

	render() {
		return (
			<div className="cover fullsize allcenter">
				<img className="logo" alt="logo" src="../assets/logo.svg" />
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
				<Button
					text="login"
					triggerLoadOnClick={true}
					onClick={this.login}
					ref={this.loginButton}
				/>
				<Logo />
				<NotificationContainer />
			</div>
		)
	}
}
