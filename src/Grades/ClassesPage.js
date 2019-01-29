import React, { Component } from 'react'
import { Menu, Logo, Table, QuarterSelector } from '../Components'
import EDUPoint from '@team-llambda/edupoint-pxpwebservices-synergy'
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
		let services = new EDUPoint.PXPWebServices(
			this.props.location.state.username,
			this.props.location.state.password,
			this.props.location.state.baseURL
		)

		// fetch from backend
		let classes = await services.getGradebook()

		classes = classes.courses.map(c => {
			console.log(c)
			return {
				class: c.title,
				grade: c.marks[0].calculatedScoreString,
				room: c.room,
				teacher: c.staff,
				period: c.period
			}
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
						widths={[2, 20, 6, 4, 4]}
						headers={['P.', 'Class', 'Teacher', 'Room', 'Grade']}
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
