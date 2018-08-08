import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import LoginPage from './LoginPage'
import ClassesPage from './Grades/ClassesPage'
import ChatPage from './ChatPage'
import SettingsPage from './SettingsPage'
import LogoutPage from './LogoutPage'
import LostPage from './LostPage'

// eslint-disable-next-line
String.prototype.isValidEmail = function() {
	// eslint-disable-next-line
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(this.toLowerCase())
}

// eslint-disable-next-line
String.prototype.isOnlyWhitespace = function() {
	if (this === '') return true
	return this.replace(/\s/g, '').length === 0
}

export default class App extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={LoginPage} />
					<Route exact path="/classes" component={ClassesPage} />
					<Route exact path="/chat" component={ChatPage} />
					<Route exact path="/settings" component={SettingsPage} />
					<Route exact path="/logout" component={LogoutPage} />
					<Route component={LostPage} />
				</Switch>
			</Router>
		)
	}
}
