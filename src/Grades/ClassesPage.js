import React, { Component } from 'react'
import { Menu, Logo, Table, QuarterSelector } from '../Components'
import EDUPoint from '@team-llambda/edupoint-pxpwebservices-synergy'

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
		let creds = JSON.parse(window.localStorage.getItem('EDUPointServices'))

		if (!creds) window.location.href = '/'

		let services = new EDUPoint.PXPWebServices(
			creds.username,
			creds.password,
			'https://wa-bsd405-psv.edupoint.com/'
		)

		// fetch from backend
		let gradebook = await services.getGradebook()

		let currentPeriod = 0
		for (; currentPeriod < gradebook.reportingPeriods.length; currentPeriod++) {
			let rP = gradebook.reportingPeriods[currentPeriod]
			let now = new Date()
			if (rP.startDate <= now && now <= rP.endDate) {
				break
			}
		}

		let classes = gradebook.courses.map(c => {
			return {
				class: c.title,
				grade: c.marks[0].calculatedScoreString,
				room: c.room,
				teacher: c.staff,
				period: c.period
			}
		})

		this.setState({ classes: classes, quarter: currentPeriod, services })
	}

	handleClassClick = period => {
		// go to class detail page of selected period
		// window.location.href = '/classes/' + period
		this.props.history.push(`/classes/${period}`, {
			quarter: this.state.quarter
		})
	}

	handleQuarterChange = async quarter => {
		let services = this.state.services

		// fetch from backend
		let gradebook = await services.getGradebook(quarter)

		let classes = gradebook.courses.map(c => {
			return {
				class: c.title,
				grade: c.marks[0].calculatedScoreString,
				room: c.room,
				teacher: c.staff,
				period: c.period
			}
		})

		this.setState({ classes: classes, quarter })
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
				<QuarterSelector
					quarter={this.state.quarter}
					handleQuarterChange={this.handleQuarterChange}
				/>
				{/* <Logo /> */}
			</div>
		)
	}
}
