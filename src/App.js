import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import LoginPage from './LoginPage'
import ClassesPage from './Grades/ClassesPage'
import ChatPage from './ChatPage'
import SettingsPage from './SettingsPage'
import LogoutPage from './LogoutPage'
import LostPage from './LostPage'
import SingleClassPage from './Grades/SingleClassPage'
import { Chart } from 'chart.js'
import 'react-notifications/lib/notifications.css'

Chart.defaults.global.defaultFontFamily = 'Sofia-Pro'

export default class App extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={LoginPage} />
					<Route exact path="/classes" component={ClassesPage} />
					<Route exact path="/classes/:period" component={SingleClassPage} />
					<Route exact path="/chat" component={ChatPage} />
					<Route exact path="/settings" component={SettingsPage} />
					<Route exact path="/logout" component={LogoutPage} />
					<Route component={LostPage} />
				</Switch>
			</Router>
		)
	}
}
