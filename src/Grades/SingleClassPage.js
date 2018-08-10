import React, { Component } from 'react'
import { Logo, Menu, QuarterSelector, CourseInfoPane } from '../Components'

export default class SingleClassPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			assignments: [],
			categories: [],
			projectedAssignments: []
		}
	}

	componentDidMount() {
		const { period } = this.props.match.params

		// TODO: call route to replace this temp data
		const assignments = [
			{
				date: '05/20/18',
				name: 'Homework 11',
				score: 20,
				available: 25,
				comments:
					'Keep up the great work! Lorem ipsum jk im too lazy to copy the lorem ipsum here we go memememememmememememmememememe',
				category: 'Homework'
			},
			{
				date: '12/22/22',
				name: 'Really long assignment',
				score: 22,
				available: 25,
				comments: 'Keep up the great work!',
				category: 'Tests'
			},
			{
				date: '12/22/22',
				name: 'Really really really really long assignment',
				score: 24,
				available: 25,
				comments: 'Keep up the great work!',
				category: 'Tests'
			}
		]

		const projectedAssignments = assignments.slice()

		const categories = [
			{
				name: 'Tests',
				weight: 0.6
			},
			{
				name: 'Homework',
				weight: 0.2
			},
			{
				name: 'Projects',
				weight: 0.2
			}
		]

		this.setState({
			period: period,
			assignments: assignments,
			categories: categories
			//projectedAssignments: projectedAssignments
		})
	}

	render() {
		return (
			<div className="fullsize">
				<Menu currentItemIndex={0} />
				<div className="content">
					<h1>Period {this.state.period}</h1>
					<CourseInfoPane
						assignments={this.state.assignments}
						categories={this.state.categories}
						projectedAssignments={this.state.projectedAssignments}
					/>
				</div>
				<QuarterSelector />
				<Logo />
			</div>
		)
	}
}
