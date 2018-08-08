import React, { Component } from 'react'
import { Button, Logo, Textbox, QuarterSelector } from './Components'

export default class LoginPage extends Component {
	render() {
		return (
			<div className="cover fullsize allcenter">
				<img
					style={{ height: '4em', marginBottom: '1em' }}
					src="../assets/logo.svg"
				/>
				<Textbox hint="Username" />
				<Textbox hint="Password" type="password" />
				<Button text="login" triggerLoadOnClick={true} />
				<Logo />
			</div>
		)
	}
}
