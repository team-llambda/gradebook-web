import React, { Component } from 'react'
import {
	Logo,
	Menu,
	QuarterSelector,
	Textbox,
	EditableInput,
	Dropdown
} from '../Components'
import { Radar, Line } from 'react-chartjs-2'
import EDUPoint from '@team-llambda/edupoint-pxpwebservices-synergy'
import gb from '@team-llambda/gradebook-api'
import moment from 'moment'

let effProp = (assignment, property) => {
	if (assignment.altered) return assignment.altered[property]
	return assignment[property]
}

// hashcode for string
let hashCode = s => {
	let hash = 0,
		i,
		chr
	if (s.length === 0) return hash
	for (i = 0; i < s.length; i++) {
		chr = s.charCodeAt(i)
		hash = (hash << 5) - hash + chr
		hash |= 0 // Convert to 32bit integer
	}
	return hash
}

export default class SingleClassPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			assignments: [],
			categories: []
		}
	}

	async componentDidMount() {
		// fetches the period from the redirect
		let { period } = this.props.match.params
		let { quarter } = this.props.location.state

		let creds = JSON.parse(window.localStorage.getItem('EDUPointServices'))

		if (!creds) window.location.href = '/'

		let services = new EDUPoint.PXPWebServices(
			creds.username,
			creds.password,
			'https://wa-bsd405-psv.edupoint.com/'
		)

		let gradebook = await services.getGradebook(quarter)
		let course = gradebook.courses[period - 1].marks[0] // always use first marks (not sure what the others are)

		// sanitize assignment data
		let assignments = course.assignments.map((a, i) => {
			a._id = i
			if (a.actualScore === undefined || a.actualScore === null) {
				a.score = 0
				a.available = 0
			} else {
				a.score = a.actualScore
				a.available = a.assignedScore
			}
			a.category = a.type
			a.name = a.measure
			a.comments = a.notes

			delete a.measure
			delete a.type
			delete a.actualScore
			delete a.assignedScore
			delete a.notes

			// format the date
			let str = a.date.toString()
			let front = str.split(':')[0]
			let parts = front.split(' ')

			a.date = parts[1] + ' ' + parts[2]

			return a
		})

		// sanitize category data
		let categories = []

		if (course.gradeCalculation.length > 0) {
			for (let c of course.gradeCalculation) {
				// dont include the TOTAL category
				if (c.type === 'TOTAL') continue

				let category = {
					name: c.type,
					weight: c.weight,
					score: 0,
					available: 0
				}

				// get the status for the category
				assignments
					.filter(a => a.category === c.type)
					.forEach(a => {
						category.score += a.score
						category.available += a.available
					})

				categories.push(category)
			}
		}

		this.setState({
			period: period,
			assignments: assignments,
			categories: categories,
			quarter,
			services
		})
	}

	handleQuarterChange = async quarter => {
		let services = this.state.services

		let gradebook = await services.getGradebook(quarter)

		let course = gradebook.courses[this.state.period - 1].marks[0] // always use first marks (not sure what the others are)

		// sanitize assignment data
		let assignments = course.assignments.map((a, i) => {
			a._id = i
			if (a.actualScore === undefined || a.actualScore === null) {
				a.score = 0
				a.available = 0
			} else {
				a.score = a.actualScore
				a.available = a.assignedScore
			}

			a.category = a.type
			a.name = a.measure
			a.comments = a.notes

			delete a.measure
			delete a.type
			delete a.actualScore
			delete a.assignedScore
			delete a.notes

			// format the date
			let str = a.date.toString()
			let front = str.split(':')[0]
			let parts = front.split(' ')

			a.date = parts[1] + ' ' + parts[2]

			return a
		})

		// sanitize category data
		let categories = []

		if (course.gradeCalculation.length > 0) {
			for (let c of course.gradeCalculation) {
				// dont include the TOTAL category
				if (c.type === 'TOTAL') continue

				let category = {
					name: c.type,
					weight: c.weight,
					score: 0,
					available: 0
				}

				// get the status for the category
				assignments
					.filter(a => a.category === c.type)
					.forEach(a => {
						category.score += a.score
						category.available += a.available
					})

				categories.push(category)
			}
		}

		this.setState({
			assignments: assignments,
			categories: categories,
			quarter
		})
	}

	alterAssignment = (field, value, id) => {
		let assignmentsCopy = this.state.assignments.slice()
		let alteredAssignment = assignmentsCopy.filter(a => a._id === id)[0]

		alteredAssignment.altered = {
			score: effProp(alteredAssignment, 'score'),
			available: effProp(alteredAssignment, 'available'),
			category: effProp(alteredAssignment, 'category')
		}

		switch (field) {
			case 'score':
				alteredAssignment.altered.score = Number(value)
				break
			case 'percentage':
				let newScore =
					(Number(value) / 100) * alteredAssignment.altered.available
				alteredAssignment.altered.score = newScore
				break
			case 'available':
				alteredAssignment.altered.available = Number(value)
				break
			case 'category':
				alteredAssignment.altered.category = value
				break
		}

		// check if the altered is the same as unaltered
		let altered = alteredAssignment.altered
		if (
			altered.score === alteredAssignment.score &&
			altered.available === alteredAssignment.available &&
			altered.category === alteredAssignment.category
		) {
			alteredAssignment.altered = undefined
		}

		this.setState({ assignments: assignmentsCopy })
	}

	deleteAssignment = id => {
		let assignmentsCopy = this.state.assignments.slice()
		let alteredAssignment = assignmentsCopy.filter(a => a._id === id)[0]

		if (alteredAssignment.projected) {
			let i = 0
			for (; i < assignmentsCopy.length; i++) {
				if (assignmentsCopy[i]._id === alteredAssignment._id) {
					assignmentsCopy.splice(i, 1)
					this.setState({ assignments: assignmentsCopy })
					break
				}
			}
			return
		}

		if (alteredAssignment.score === 0 && alteredAssignment.available === 0)
			return

		alteredAssignment.altered = {
			score: 0,
			available: 0,
			category: effProp(alteredAssignment, 'category')
		}

		this.setState({ assignments: assignmentsCopy })
	}

	resetAssignment = id => {
		let assignmentsCopy = this.state.assignments.slice()
		let alteredAssignment = assignmentsCopy.filter(a => a._id === id)[0]

		alteredAssignment.altered = undefined

		this.setState({ assignments: assignmentsCopy })
	}

	resetAssignments = () => {
		let assignmentsCopy = this.state.assignments.slice()

		for (let i = assignmentsCopy.length - 1; i >= 0; i--) {
			let a = assignmentsCopy[i]

			if (a.projected) assignmentsCopy.splice(i, 1)
			else a.altered = undefined
		}

		this.setState({ assignments: assignmentsCopy })
	}

	addAssignment = () => {
		let assignmentsCopy = this.state.assignments.slice()

		assignmentsCopy.reverse()
		assignmentsCopy.push({
			available: 0,
			category:
				this.state.categories.length > 0 ? this.state.categories[0].name : '',
			comments: '',
			date: moment().format('MM/DD/YYYY'),
			name: 'Projected Assignment',
			score: 0,
			projected: true,
			_id: assignmentsCopy.length
		})

		assignmentsCopy.reverse()

		this.setState({ assignments: assignmentsCopy })
	}

	getRunningGrade = assignments => {
		assignments = assignments
			.slice()
			.filter(a => !a.comments.includes('Not For Grading'))
		let categories = this.state.categories.slice()

		if (categories.length === 0) {
			var points = 0
			var total = 0
			assignments.forEach(a => {
				points += effProp(a, 'score')
				total += effProp(a, 'available')
			})
			// if (total === 0) return 0
			return ((points / total) * 100).toFixed(2)
		}

		var grade = 0

		categories.forEach(category => {
			var points = 0
			var total = 0
			assignments.forEach(assignment => {
				if (effProp(assignment, 'category') === category.name) {
					points += effProp(assignment, 'score')
					total += effProp(assignment, 'available')
				}
			})
			if (total === 0) {
				grade += category.weight
			} else {
				grade += (category.weight * points) / total
			}
		})

		return (grade * 100).toFixed(2)
	}

	parseGraphData = () => {
		var data = { x: [], y: [] }
		var cumulativeAssignments = []
		this.state.assignments
			.slice()
			.sort((a, b) => new Date(b.date) - new Date(a.date))
			.reverse()
			.forEach(assignment => {
				cumulativeAssignments.push(assignment)

				data.x.push(assignment.date)

				let grade = this.getRunningGrade(cumulativeAssignments)

				data.y.push(grade)
			})

		return data
	}

	goBack = () => {
		window.location.href = '/classes'
	}

	render() {
		let data = this.parseGraphData()
		return (
			<div className="fullsize">
				<Menu currentItemIndex={0} />
				<div className="content">
					<h1>Period {this.state.period}</h1>
					<h3 onClick={this.goBack} className="back">
						Back
					</h3>
					<CourseInfoPane
						assignments={this.state.assignments}
						categories={this.state.categories}
						alterAssignment={this.alterAssignment}
						resetAssignment={this.resetAssignment}
						resetAssignments={this.resetAssignments}
						deleteAssignment={this.deleteAssignment}
						addAssignment={this.addAssignment}
						selectCategory={(c, id) => {
							this.alterAssignment('category', c, id)
						}}
					/>
					<div className="grades-chart">
						<Line
							data={{
								labels: data.x,
								datasets: [
									{
										data: data.y,
										label: 'My Grades',
										fill: true,
										backgroundColor: 'rgba(82,122,255,0.4)',
										borderColor: 'rgba(82,122,255,1)',
										borderCapStyle: 'butt',
										borderDash: [],
										cubicInterpolationMode: 'monotone',
										borderDashOffset: 0.0,
										borderJoinStyle: 'miter',
										pointBorderColor: 'rgba(82,122,255,1)',
										pointBackgroundColor: '#fff',
										pointHoverBackgroundColor: 'rgba(82,122,255,1)',
										pointHoverBorderColor: 'rgba(82,122,255,0.4)',
										pointRadius: 4,
										pointBorderWidth: 2,
										pointHoverRadius: 4,
										pointHoverBorderWidth: 4,
										pointHitRadius: 8
									}
								]
							}}
							options={{
								legend: {
									display: false
								},
								maintainAspectRatio: false,
								scales: {
									yAxes: [
										{
											ticks: {
												fontSize: 12,
												beginAtZero: true,
												suggestedMax: 100
											}
										}
									],
									xAxes: [{ ticks: { fontSize: 12 } }]
								},
								tooltips: {
									callbacks: {
										title: (items, data) => {
											let index = items[0].index

											return this.state.assignments[
												this.state.assignments.length - 1 - index
											].name
										},
										label: (item, data) => {
											let index = item.index

											return this.state.assignments[
												this.state.assignments.length - 1 - index
											].category
										},
										labelColor: (item, data) => {
											let index = item.index

											var category = this.state.assignments[
												this.state.assignments.length - 1 - index
											].category
											var hex = Math.abs(hashCode(category))
												.toString(16)
												.substring(0, 6)
											return {
												borderColor: '#' + hex,
												backgroundColor: '#' + hex
											}
										}
									}
								}
							}}
						/>
					</div>
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

class CourseInfoPane extends Component {
	constructor(props) {
		super(props)

		this.state = {
			page: 'assignments'
		}

		this.assignmentsPane = React.createRef()
	}

	render() {
		return (
			<div className="course-info-pane">
				<div className="type-selector">
					<h3
						onClick={() => this.setState({ page: 'assignments' })}
						className={this.state.page === 'assignments' ? 'highlight' : ''}>
						Assignments
					</h3>
					{this.props.categories.length > 0 && (
						<h3
							onClick={() => this.setState({ page: 'categories' })}
							className={this.state.page === 'categories' ? 'highlight' : ''}>
							Categories
						</h3>
					)}
				</div>

				{this.state.page === 'assignments' && (
					<AssignmentsPane
						ref={this.assignmentsPane}
						assignments={this.props.assignments}
						categories={this.props.categories}
						alterAssignment={this.props.alterAssignment}
						deleteAssignment={this.props.deleteAssignment}
						resetAssignment={this.props.resetAssignment}
						resetAssignments={this.props.resetAssignments}
						addAssignment={this.props.addAssignment}
						selectCategory={this.props.selectCategory}
					/>
				)}

				{this.state.page === 'categories' && (
					<CategoriesPane categories={this.props.categories} />
				)}

				<FinalGrades
					assignments={this.props.assignments}
					categories={this.props.categories}
				/>
			</div>
		)
	}
}
class FinalGrades extends Component {
	getGrades = (assignments, categories) => {
		assignments = assignments
			.slice()
			.filter(a => !a.comments.includes('Not For Grading'))

		// if there are no categories, grade is simple
		if (categories.length === 0) {
			var points = 0
			var total = 0
			assignments.forEach(a => {
				points += effProp(a, 'score')
				total += effProp(a, 'available')
			})
			return ((points / total) * 100).toFixed(2)
		}

		// account for categories that do not have assignments in them
		// make deep copy of categories
		let effectiveCategories = JSON.parse(JSON.stringify(categories))

		// remove categories with no assignments
		for (let i = 0; i < effectiveCategories.length; i++) {
			if (effectiveCategories[i].available === 0) {
				effectiveCategories.splice(i, 1)
				i--
			}
		}

		// effectiveCategories now only has categories that have assignments in them;
		// scale the category weights as necessary
		let weightSum = effectiveCategories.reduce((a, c) => a + c.weight, 0)
		let scaleFactor = 1 / weightSum
		effectiveCategories.forEach(c => {
			c.weight *= scaleFactor
		})

		// calculate grade based on category weights
		var grade = 0
		effectiveCategories.forEach(category => {
			var points = 0
			var total = 0
			assignments.forEach(assignment => {
				if (assignment.category === category.name) {
					points += assignment.score
					total += assignment.available
				}
			})
			if (total === 0) {
				grade += category.weight
			} else {
				grade += (category.weight * points) / total
			}
		})

		return (grade * 100).toFixed(2)
	}

	getProjectedGrades = (assignments, categories) => {
		assignments = assignments
			.slice()
			.filter(a => !a.comments.includes('Not For Grading'))

		// check if there are projections at all
		let hasProjection = false
		for (let a of assignments) {
			if (a.altered) {
				hasProjection = true
				break
			}
		}

		if (!hasProjection) return null

		// if this class has no categories, ez
		if (categories.length === 0) {
			var points = 0
			var total = 0
			assignments.forEach(a => {
				points += effProp(a, 'score')
				total += effProp(a, 'available')
			})
			return ((points / total) * 100).toFixed(2)
		}

		let grade = 0
		categories.forEach(category => {
			var points = 0
			var total = 0
			assignments.forEach(assignment => {
				if (effProp(assignment, 'category') === category.name) {
					points += effProp(assignment, 'score')
					total += effProp(assignment, 'available')
				}
			})
			if (total === 0) {
				grade += category.weight
			} else {
				grade += (category.weight * points) / total
			}
		})

		return (grade * 100).toFixed(2)
	}

	render() {
		let projected = this.getProjectedGrades(
			this.props.assignments,
			this.props.categories
		)
		var grade = this.getGrades(this.props.assignments, this.props.categories)
		return (
			<div className="final-grades">
				<h1>{grade}</h1>
				{projected && <h3 className="highlight nolink">{projected}</h3>}
			</div>
		)
	}
}

class AssignmentsPane extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filter: '',
			assignments: this.props.assignments || [],
			expandedAssignment: null
		}
	}

	componentWillReceiveProps(newProps) {
		this.setState({ assignments: newProps.assignments })
	}

	handleFilterChange = text => {
		this.setState({ filter: text })
	}

	handleClick = index => {
		if (this.state.expandedAssignment !== null) {
			if (this.state.expandedAssignment === index) {
				this.setState({ expandedAssignment: null })
			} else {
				this.setState({ expandedAssignment: index })
			}
		} else {
			this.setState({ expandedAssignment: index })
		}
	}

	render() {
		var filter = this.state.filter.toLowerCase()
		var shownAssignments = this.state.assignments.slice().filter(a => {
			let concat =
				a.name +
				a.score +
				a.available +
				a.comments +
				a.category +
				a.date +
				(a.score / a.available) * 100

			return concat.toLowerCase().includes(filter)
		})
		return (
			<div className="assignments-pane">
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center'
					}}>
					<Textbox
						inputStyle={{ width: 'calc(100% - 3em - 6px)' }}
						style={{ flexGrow: '2', marginRight: '1em', marginTop: 0 }}
						hint="filter"
						onTextChange={this.handleFilterChange}
					/>
					<i
						onClick={this.props.resetAssignments}
						className="material-icons projection-control">
						autorenew
					</i>
					<i
						onClick={this.props.addAssignment}
						className="material-icons projection-control">
						add
					</i>
				</div>

				<div className="assignments-content">
					{shownAssignments.map((assignment, index) => {
						return (
							<Assignment
								id={assignment._id}
								key={assignment._id}
								expanded={this.state.expandedAssignment === index}
								altered={assignment.altered}
								alterAssignment={this.props.alterAssignment}
								selectCategory={this.props.selectCategory}
								handleClick={() => this.handleClick(index)}
								date={assignment.date}
								name={assignment.name}
								score={assignment.score}
								available={assignment.available}
								category={assignment.category}
								categories={this.props.categories}
								delete={this.props.deleteAssignment}
								reset={this.props.resetAssignment}
								comments={assignment.comments}
								last={index === shownAssignments.length - 1}
							/>
						)
					})}
				</div>
			</div>
		)
	}
}

class Assignment extends Component {
	constructor(props) {
		super(props)

		this.commentsDiv = React.createRef()
	}

	getPercentage = () => {
		if (this.props.altered) {
			if (this.props.altered.available > 0) {
				return (
					(this.props.altered.score / this.props.altered.available) *
					100
				).toFixed(2)
			}

			if (this.props.altered.score > 0) return this.props.altered.score + ' EC'

			return 'N/A'
		} else {
			if (this.props.available > 0)
				return ((this.props.score / this.props.available) * 100).toFixed(2)

			if (this.props.score > 0) return this.props.score + ' EC'

			return 'N/A'
		}
	}

	getScore = () => {
		if (this.props.altered) return this.props.altered.score
		else return this.props.score
	}

	getAvailable = () => {
		if (this.props.altered) return this.props.altered.available
		else return this.props.available
	}

	getCategory = () => {
		if (this.props.altered) return this.props.altered.category
		else return this.props.category
	}

	render() {
		let percentage = this.getPercentage()
		let category = this.getCategory()
		// console.log(this.props.date)
		return (
			<div className={'assignment' + (this.props.last ? ' last' : '')}>
				<div className="assignment-main">
					<h5 className="assignment-date">{this.props.date}</h5>
					<svg
						height="12"
						width="12"
						style={{ paddingTop: '0.45em', marginRight: '0.5em' }}>
						<circle cx="6" cy="6" r="4" fill="#12EB9D" />
					</svg>
					<div className="assignment-info">
						<div className="assignment-name-grade">
							<h4
								className={
									'assignment-name' + (percentage === 'N/A' ? ' gray' : '')
								}
								onClick={this.props.handleClick}>
								{this.props.name}
							</h4>
							<EditableInput
								className={
									this.props.altered
										? 'highlight'
										: percentage === 'N/A' ||
										  this.props.comments.includes('Not For Grading')
										? 'gray'
										: ''
								}
								highlight={this.props.altered}
								value={percentage}
								handleChange={newValue =>
									this.props.alterAssignment(
										'percentage',
										newValue,
										this.props.id
									)
								}
							/>
						</div>
						<div className="assignment-category">
							<Dropdown
								items={this.props.categories.map(c => c.name)}
								highlight={this.props.altered}
								selectedIndex={this.props.categories
									.map(c => c.name)
									.indexOf(category)}
								select={(category, index) => {
									this.props.selectCategory(category, this.props.id)
								}}
							/>
							<div className={'assignment-fraction'}>
								<EditableInput
									className={'small' + (this.props.altered ? ' highlight' : '')}
									value={this.getScore()}
									highlight={this.props.altered}
									handleChange={newValue =>
										this.props.alterAssignment('score', newValue, this.props.id)
									}
								/>
								<h5>/</h5>
								<EditableInput
									className={'small' + (this.props.altered ? ' highlight' : '')}
									value={this.getAvailable()}
									highlight={this.props.altered}
									handleChange={newValue =>
										this.props.alterAssignment(
											'available',
											newValue,
											this.props.id
										)
									}
								/>
							</div>
						</div>
					</div>
				</div>
				<div
					ref={this.commentsDiv}
					className={
						'assignment-comments' + (this.props.expanded ? ' expanded' : '')
					}>
					<div className="assignment-comments-content">
						<h4>Comments</h4>
						<p ref="comments">{this.props.comments}</p>
					</div>
					<div className="assignment-controls">
						<i
							onClick={() => {
								this.props.delete(this.props.id)
							}}
							className="material-icons assignment-action">
							delete
						</i>
						<i
							onClick={() => {
								this.props.reset(this.props.id)
							}}
							className="material-icons assignment-action">
							autorenew
						</i>
					</div>
				</div>
			</div>
		)
	}
}

class CategoriesPane extends Component {
	render() {
		let categories = this.props.categories.map((category, index) => {
			return (
				<Category
					key={category.name}
					name={category.name}
					score={category.score}
					available={category.available}
					weight={category.weight}
				/>
			)
		})

		let data = {
			labels: this.props.categories.map(c => c.name),
			datasets: [
				{
					label: 'Category Performance',
					backgroundColor: 'rgba(179,181,198,0.2)',
					borderColor: 'rgba(179,181,198,1)',
					pointBackgroundColor: 'rgba(179,181,198,1)',
					pointBorderColor: '#fff',
					pointHoverBackgroundColor: '#fff',
					pointHoverBorderColor: 'rgba(179,181,198,1)',
					data: this.props.categories
						.slice()
						.map(c => (c.available > 0 ? (c.score / c.available) * 100 : 100))
				}
			]
		}

		return (
			<div className="categories-pane">
				<div style={{ height: '16em' }}>
					<Radar
						options={{
							layout: {
								padding: {
									bottom: 5
								}
							},
							legend: {
								display: false
							},
							scale: {
								ticks: {
									//fontSize: 32,
									beginAtZero: true,
									min: 0,
									max: 100,
									stepSize: 20,
									userCallback: function(label, index, labels) {
										// when the floored value is the same as the value we have a whole number
										if (Math.floor(label) === label) {
											return label
										}
									}
								},
								pointLabels: { fontSize: 18 }
							},
							maintainAspectRatio: false
						}}
						data={data}
					/>
				</div>
				<div
					style={{
						position: 'absolute',
						top: '16em',
						height: 'calc(100% - 17em)',
						width: '100%',
						marginTop: '1em'
					}}>
					{categories}
				</div>
			</div>
		)
	}
}

class Category extends Component {
	render() {
		return (
			<div className="category">
				<div className="category-name-grade">
					<h4 className="category-name">{this.props.name}</h4>
					<h4 className="category-grade">
						{this.props.available === 0
							? 'N/A'
							: ((this.props.score / this.props.available) * 100).toFixed(2) +
							  '%'}
					</h4>
				</div>
				<div className="category-details">
					<h5>{this.props.score + '/' + this.props.available}</h5>
					<h5>
						{this.props.available === 0
							? '0/0%'
							: (
									(this.props.score / this.props.available) *
									this.props.weight *
									100
							  ).toFixed(2) +
							  '/' +
							  (this.props.weight * 100).toFixed(2) +
							  '%'}
					</h5>
				</div>
			</div>
		)
	}
}
