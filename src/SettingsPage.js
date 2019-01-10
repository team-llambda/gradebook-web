import React, { Component } from 'react'
import { Menu, Logo, Button } from './Components'
import gb from '@team-llambda/gradebook-api'

export default class SettingsPage extends Component {
	constructor(props) {
		super(props)
	}

	deactivate = async () => {
		let res = await gb.deactivate()

		if (res.status === 200) {
			window.location.href = '/'
		} else {
			// TODO: some shit happen
		}
	}

	render() {
		return (
			<div className="fullsize">
				<Menu currentItemIndex={2} />
				<div className="content">
					<h1>Settings</h1>
					<div className="card deactivate">
						<h3 style={{ color: 'white', cursor: 'default' }}>
							Deactivate Account
						</h3>
						<h4 style={{ color: 'white' }}>
							The Gradebook team uses industry-standard security practices, and
							your information is secure inside our system. However, if you
							still feel uncomfortable about using Gradebook, you may delete
							your Gradebook account and we will wipe all of our records about
							your user.
						</h4>
						<Button
							style={{
								background: 'white',
								color: '#f05056'
							}}
							text="Deactivate"
							onClick={this.deactivate}
						/>
					</div>
				</div>
				<Logo />
			</div>
		)
	}
}
