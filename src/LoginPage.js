import React, { Component } from 'react'
import { Button, Logo, Textbox } from './Components'

export default class LoginPage extends Component {
	render() {
		return (
			<div className="cover fullsize allcenter">
				<img
					style={{ height: '4em', marginBottom: '1em' }}
					src="../assets/logo.png"
				/>
				<Textbox hint="email" />
				<Textbox hint="password" type="password" />
				<Button text="login" triggerLoadOnClick={true} />
				<Logo />
			</div>
		)
	}
}
