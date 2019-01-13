import React, { Component } from 'react'
import { Menu, Logo, Table, QuarterSelector } from '../Components'
import gb from '@team-llambda/gradebook-api'

const shortenName = name => {
	let parts = name
		.replace('\r', '')
		.replace('\n', '')
		.split(' ')

	parts = parts.slice(0, parts.length - 1)

	let res = ''

	for (let i = 0; i < parts.length; i++) {
		if (i === parts.length - 1) {
			res += parts[i]
		} else {
			res += parts[i].charAt(0) + '. '
		}
	}

	return res
}
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
			delete c.class_name

			// get rid of the % sign
			c.grade = Number(c.grade.replace('%', '')).toFixed(2)

			// start from the number
			c.room = c.room.substring(6)
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
						widths={[4, 18, 6, 4, 4]}
						headers={['Period', 'Class', 'Teacher', 'Room', 'Grade']}
						filter={''}
						onItemClick={this.handleClassClick}
						data={this.state.classes.slice().map(classData => {
							return {
								_id: classData.period,
								fields: [
									classData.period,
									classData.class,
									shortenName(classData.teacher),
									classData.room,
									classData.grade
								]
							}
						})}
					/>
				</div>
				<QuarterSelector />
				{/* <Logo /> */}
			</div>
		)
	}
}
