import React, { Component } from 'react'
import { Menu, Logo, Table, QuarterSelector } from '../Components'
import LoginPage from '../LoginPage'

export default class ClassesPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			classes: []
		}
	}

	componentDidMount() {
		// TODO: use some async function here
		// heres temporary data before backend integration
		const classes = [
			{
				period: '1',
				class: 'AP Calculus',
				teacher: 'Helene Tate',
				room: '1106',
				grade: 95.3
			},
			{
				period: '2',
				class: 'AP Physics C Mechanics',
				teacher: 'Casey Appel',
				room: '1106',
				grade: 99.9
			}
		]

		this.setState({ classes: classes })
	}

	handleClassClick = period => {
		window.location.href = '/classes/' + period
	}

	render() {
		return (
			<div className="fullsize">
				<Menu currentItemIndex={0} />
				<div className="content">
					<h1>Classes</h1>
					<Table
						widths={[4, 12, 12, 4, 4]}
						headers={['Period', 'Class', 'Teacher', 'Room', 'Grade']}
						filter={''}
						onItemClick={this.handleClassClick}
						data={this.state.classes.slice().map(classData => {
							return {
								_id: classData.period,
								fields: [
									classData.period,
									classData.class,
									classData.teacher,
									classData.room,
									classData.grade
								]
							}
						})}
					/>
				</div>
				<QuarterSelector />
				<Logo />
			</div>
		)
	}
}
