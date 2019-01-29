import React, { Component } from 'react'
import { Button, Logo, Textbox } from './Components'
import EDUPoint from '@team-llambda/edupoint-pxpwebservices-synergy'
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

		let services = new EDUPoint.PXPWebServices(
			username,
			password,
			'https://wa-bsd405-psv.edupoint.com/'
		)

		services
			.getChildList()
			.then(child => {
				this.props.history.push('/classes', {
					username,
					password,
					baseURL: 'https://wa-bsd405-psv.edupoint.com/'
				})
			})
			.catch(err => {
				console.log(err)
				NotificationManager.error('Username or password incorrect')
				this.loginButton.current.setLoading(false)
			})
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
				{/* <Logo /> */}
				<NotificationContainer />
			</div>
		)
	}
}
