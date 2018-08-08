import React, { Component } from 'react'
import { Menu, Logo } from './Components'

export default class ChatPage extends Component {
	render() {
		return (
			<div className="fullsize">
				<Menu currentItemIndex={1} />
				<div className="content">
					<h1>Chat</h1>
					<Logo />
				</div>
			</div>
		)
	}
}
