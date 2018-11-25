import React, { Component } from 'react'
import { Menu, Logo, Table, QuarterSelector } from '../Components'

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
				class: 'Chamber Orchestra',
				teacher: 'Gero',
				room: '1225',
				grade: 95.3
			},
			{
				period: '2',
				class: 'Advanced Calculus',
				teacher: 'Pham',
				room: '1106',
				grade: 98.7
			},
			{
				period: '3',
				class: 'AP Biology',
				teacher: 'Hatton',
				room: '3111',
				grade: 96.5
			},
			{
				period: '4',
				class: 'AP US History',
				teacher: 'Wong-Heffter',
				room: '2121',
				grade: 89.9
			},
			{
				period: '5',
				class: 'AP English Lang/Comp',
				teacher: 'Glowacki',
				room: '2115',
				grade: 87.6
			},
			{
				period: '6',
				class: 'AP Physics 2',
				teacher: 'Nara',
				room: '3101',
				grade: 99.2
			},
			{
				period: '7',
				class: 'AP Computer Science A',
				teacher: 'Fincher',
				room: '1401',
				grade: 101.2
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
