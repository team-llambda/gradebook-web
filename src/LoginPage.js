import React, { Component } from 'react'
import { Button } from './Components'

export default class LoginPage extends Component {
	render() {
		return (
			<div className="cover fullsize allcenter">
				<Button text="login" triggerLoadOnClick={true} />
			</div>
		)
	}
}
