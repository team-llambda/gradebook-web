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
import gb from '@team-llambda/gradebook-api'

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
		const { period } = this.props.match.params

		let data = await (await gb.getClass(period)).json()

		const assignments = data.assignments.map((a, i) => {
			a._id = i
			a.score = isNaN(a.pointsEarned) ? 0 : a.pointsEarned
			a.available = isNaN(a.pointsTotal) ? 0 : a.pointsTotal

			delete a.pointsEarned
			delete a.pointsTotal

			return a
		})

		console.log(assignments)

		let categories = []

		if (Object.keys(data.categories).length > 0) {
			for (let c in data.categories) {
				if (c === 'TOTAL') continue

				let category = {
					name: c,
					weight: data.categories[c].percentage / 100,
					score: 0,
					available: 0
				}

				assignments
					.filter(a => a.category === c)
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
			categories: categories
		})
	}

	alterAssignment = (field, value, id) => {
		let assignmentsCopy = this.state.assignments.slice()
		let alteredAssignment = assignmentsCopy.filter(a => a._id === id)[0]

		alteredAssignment.altered = {
			score: alteredAssignment.score,
			available: alteredAssignment.available
		}

		if (field === 'score') {
			// check if the alteration puts it back at to its actual score
			if (alteredAssignment.score === value) {
				alteredAssignment.altered = undefined
			} else {
				alteredAssignment.altered.score = value
			}
		} else if (field === 'percentage') {
			// check if the alteration puts it back at to its actual score
			let newScore = (value / 100) * alteredAssignment.altered.available
			if (alteredAssignment.score === newScore) {
				alteredAssignment.altered = undefined
			} else {
				alteredAssignment.altered.score = newScore
			}
		}

		this.setState({ assignment: assignmentsCopy })
	}

	resetAssignments = () => {
		let assignmentsCopy = this.state.assignments.slice()

		assignmentsCopy.forEach(a => {
			a.altered = undefined
		})

		this.setState({ assignments: assignmentsCopy })
	}

	getGrades = assignments => {
		const categories = this.state.categories.slice()
		var grade = 0

		categories.forEach(category => {
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

		return (grade * 100).toFixed(1)
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

				const grade = this.getGrades(cumulativeAssignments)

				data.y.push(grade)
			})

		return data
	}

	render() {
		const data = this.parseGraphData()
		// TODO: implement a reset button
		return (
			<div className="fullsize">
				<Menu currentItemIndex={0} />
				<div className="content">
					<h1>Period {this.state.period}</h1>
					<CourseInfoPane
						assignments={this.state.assignments}
						categories={this.state.categories}
						alterAssignment={this.alterAssignment}
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
												fontSize: 18,
												beginAtZero: true,
												suggestedMax: 100
											}
										}
									],
									xAxes: [{ ticks: { fontSize: 18 } }]
								},
								tooltips: {
									callbacks: {
										title: (items, data) => {
											const index = items[0].index

											return this.state.assignments[
												this.state.assignments.length - 1 - index
											].name
										},
										label: (item, data) => {
											const index = item.index

											return this.state.assignments[
												this.state.assignments.length - 1 - index
											].category
										},
										labelColor: (item, data) => {
											const index = item.index

											var category = this.state.assignments[
												this.state.assignments.length - 1 - index
											].category
											var hex = Math.abs(category.hashCode())
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
							height={80}
						/>
					</div>
				</div>
				<QuarterSelector />
				<Logo />
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
					<h3
						onClick={() => this.setState({ page: 'categories' })}
						className={this.state.page === 'categories' ? 'highlight' : ''}>
						Categories
					</h3>
				</div>

				{this.state.page === 'assignments' && (
					<AssignmentsPane
						ref={this.assignmentsPane}
						assignments={this.props.assignments}
						categories={this.props.categories}
						alterAssignment={this.props.alterAssignment}
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
		var grade = 0

		categories.forEach(category => {
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

		return (grade * 100).toFixed(1)
	}

	getProjectedGrades = (assignments, categories) => {
		// check if there are projections at all
		let hasProjection = false
		for (let a of assignments) {
			if (a.altered) {
				hasProjection = true
				break
			}
		}

		if (!hasProjection) return null

		let grade = 0
		categories.forEach(category => {
			var points = 0
			var total = 0
			assignments.forEach(assignment => {
				if (assignment.category === category.name) {
					if (assignment.altered) {
						points += assignment.altered.score
						total += assignment.altered.available
					} else {
						points += assignment.score
						total += assignment.available
					}
				}
			})
			if (total === 0) {
				grade += category.weight
			} else {
				grade += (category.weight * points) / total
			}
		})

		return (grade * 100).toFixed(1)
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
		var filter = this.state.filter
		var shownAssignments = this.state.assignments.slice().filter(
			a =>
				a.name.toLowerCase().includes(filter.toLowerCase()) ||
				a.score.toString().includes(filter.toLowerCase()) ||
				a.available.toString().includes(filter.toLowerCase()) ||
				((a.score / a.available) * 100)
					.toFixed(1)
					.toString()
					.includes(filter.toLowerCase()) ||
				a.comments.toLowerCase().includes(filter.toLowerCase()) ||
				a.category.toLowerCase().includes(filter.toLowerCase()) ||
				a.date.toLowerCase().includes(filter.toLowerCase())
		)
		return (
			<div className="assignments-pane">
				<Textbox
					inputStyle={{ width: 'calc(22.6em - 6px)' }}
					style={{ marginBottom: '1em' }}
					hint="filter"
					onTextChange={this.handleFilterChange}
				/>
				{/* TODO: INSERT ASSIGNMENT CREATION MEME */}
				<div className="assignments-content">
					{shownAssignments.map((assignment, index) => {
						return (
							<Assignment
								id={assignment._id}
								key={assignment.name + ' ' + assignment.date}
								expanded={this.state.expandedAssignment === index}
								altered={assignment.altered}
								alterAssignment={this.props.alterAssignment}
								handleClick={() => this.handleClick(index)}
								date={assignment.date}
								name={assignment.name}
								score={assignment.score}
								available={assignment.available}
								category={assignment.category}
								categories={this.props.categories}
								comments={assignment.comments}
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
		if (this.props.altered)
			return (
				(this.props.altered.score / this.props.altered.available) *
				100
			).toFixed(1)
		else {
			if (this.props.available > 0)
				return ((this.props.score / this.props.available) * 100).toFixed(1)

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

	render() {
		let percentage = this.getPercentage()
		return (
			<div className="assignment">
				<div className="assignment-main">
					<h5 className="assignment-date">{this.props.date}</h5>
					<svg
						height="12"
						width="12"
						style={{ paddingTop: '0.6em', marginRight: '1em' }}>
						<circle cx="6" cy="6" r="6" fill="#12EB9D" />
					</svg>
					<div className="assignment-info">
						<div className="assignment-name-grade">
							<h4 className="assignment-name" onClick={this.props.handleClick}>
								{this.props.name}
							</h4>
							<EditableInput
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
								selectedIndex={this.props.categories
									.map(c => c.name)
									.indexOf(this.props.category)}
							/>
							<div
								className={
									'assignment-fraction' +
									(this.props.altered ? ' highlight' : '')
								}>
								<EditableInput
									className="small"
									value={this.getScore()}
									highlight={this.props.altered}
									handleChange={newValue =>
										this.props.alterAssignment('score', newValue, this.props.id)
									}
								/>
								<h5>/</h5>
								<h4
									className={'editable-input small'}
									style={this.props.altered}
									onClick={this.enableEditing}>
									{this.getAvailable()}
								</h4>
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
						<i className="material-icons assignment-action">delete</i>
						<i className="material-icons assignment-action">autorenew</i>
					</div>
				</div>
			</div>
		)
	}
}

class CategoriesPane extends Component {
	render() {
		const categories = this.props.categories.map((category, index) => {
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

		const data = {
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
			<div
				style={{
					height: 'calc(100% - 12em)',
					overflow: 'hidden',
					position: 'relative'
				}}>
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
						overflow: 'auto',
						top: '16em',
						height: 'calc(100% - 17em)',
						width: '100%',
						marginTop: '1em',
						paddingRight: '1em'
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
							? '100.0%'
							: ((this.props.score / this.props.available) * 100).toFixed(1) +
							  '%'}
					</h4>
				</div>
				<div className="category-details">
					<h5>{this.props.score + '/' + this.props.available}</h5>
					<h5>
						{this.props.available === 0
							? (this.props.weight * 100).toFixed(1) +
							  '/' +
							  (this.props.weight * 100).toFixed(1) +
							  '%'
							: (
									(this.props.score / this.props.available) *
									this.props.weight *
									100
							  ).toFixed(1) +
							  '/' +
							  (this.props.weight * 100).toFixed(1) +
							  '%'}
					</h5>
				</div>
			</div>
		)
	}
}
