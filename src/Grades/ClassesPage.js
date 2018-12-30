import React, { Component } from 'react'
import { Menu, Logo, Table, QuarterSelector } from '../Components'
import gb from '@team-llambda/gradebook-api'

export default class ClassesPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			classes: []
		}
	}

	async componentDidMount() {
		// fetch from backend
		let classes = (await (await gb.getClasses()).json()).data

		// convert data to native format
		classes.forEach(c => {
			c.class = c.class_name
			c.grade = Number(c.grade.substring(0, c.grade.length - 1)).toFixed(1)
			c.room = c.room.substring(6)
			delete c.class_name
		})

		this.setState({ classes: classes })
	}

	handleClassClick = period => {
		// go to class detail page of selected period
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
