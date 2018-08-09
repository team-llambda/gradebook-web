import React, { Component } from 'react'
import { Logo, Menu, QuarterSelector, CourseInfoPane } from '../Components'

export default class SingleClassPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			assignments: [],
			categories: []
		}
	}

	componentDidMount() {
		const { period } = this.props.match.params

		// TODO: call route to replace this temp data
		const assignments = [
			{
				date: '05/20/18',
				name: 'Homework 11',
				grade: 92.0,
				comments:
					'Keep up the great work! Lorem ipsum jk im too lazy to copy the lorem ipsum here we go memememememmememememmememememe',
				category: 'Homework'
			},
			{
				date: '12/22/22',
				name: 'Really long assignment',
				grade: 92.0,
				comments: 'Keep up the great work!',
				category: 'Test'
			},
			{
				date: '12/22/22',
				name: 'Really really really really long assignment',
				grade: 92.0,
				comments: 'Keep up the great work!',
				category: 'Test'
			}
		]

		this.setState({ period: period, assignments: assignments })
	}

	render() {
		return (
			<div className="fullsize">
				<Menu currentItemIndex={0} />
				<div className="content">
					<h1>Period {this.state.period}</h1>
					<CourseInfoPane assignments={this.state.assignments} />
				</div>
				<QuarterSelector />
				<Logo />
			</div>
		)
	}
}
