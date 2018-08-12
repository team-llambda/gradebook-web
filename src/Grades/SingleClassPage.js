import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Logo, Menu, QuarterSelector, Textbox } from '../Components'
import { Radar, Line } from 'react-chartjs-2'

export default class SingleClassPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			assignments: [],
			categories: []
		}
	}

	componentDidMount() {
		// fetches the period from the redirect
		const { period } = this.props.match.params

		// TODO: call route w/ period to replace this temp data
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

		const categories = [
			{
				name: 'Tests',
				weight: 0.6,
				score: 46,
				available: 50
			},
			{
				name: 'Homework',
				weight: 0.1,
				score: 20,
				available: 25
			},
			{
				name: 'Projects',
				score: 0,
				available: 0,
				weight: 0.1
			},
			{
				name: 'Quizzes',
				score: 0,
				available: 0,
				weight: 0.1
			},
			{
				name: 'Memes',
				score: 0,
				available: 0,
				weight: 0.1
			}
		]

		this.setState({
			period: period,
			assignments: assignments,
			categories: categories
		})
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
		this.state.assignments.slice().forEach(assignment => {
			cumulativeAssignments.push(assignment)

			data.x.push(assignment.date)

			const grade = this.getGrades(cumulativeAssignments)

			data.y.push(grade)
		})

		return data
	}

	render() {
		const data = this.parseGraphData()
		return (
			<div className="fullsize">
				<Menu currentItemIndex={0} />
				<div className="content">
					<h1>Period {this.state.period}</h1>
					<CourseInfoPane
						assignments={this.state.assignments}
						categories={this.state.categories}
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
									yAxes: [{ ticks: { fontSize: 18 } }],
									xAxes: [{ ticks: { fontSize: 18 } }]
								},
								tooltips: {
									callbacks: {
										title: (items, data) => {
											const index = items[0].index

											return this.state.assignments[index].name
										},
										label: (item, data) => {
											const index = item.index

											return this.state.assignments[index].category
										},
										labelColor: (item, data) => {
											const index = item.index

											var category = this.state.assignments[index].category
											var hex = Math.abs(category.hashCode())
												.toString(16)
												.substring(0, 6)
											console.log(hex)
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
			page: 'assignments',

			// should stay empty until there are modifications to the assignments
			projectedAssignments: []
		}

		this.assignmentsPane = React.createRef()
	}

	handleProjectionChange = projectedAssignments => {
		this.setState({ projectedAssignments: projectedAssignments })
	}

	handleProjectionReset = () => {
		// TODO: implement projection reset
		this.assignmentsPane.current.resetProjection()
		this.setState({ projectedAssignments: [] })
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
						onProjectionChange={this.handleProjectionChange}
					/>
				)}

				{this.state.page === 'categories' && (
					<CategoriesPane categories={this.props.categories} />
				)}

				<FinalGrades
					assignments={this.props.assignments}
					categories={this.props.categories}
					projectedAssignments={this.state.projectedAssignments}
				/>
			</div>
		)
	}
}
class FinalGrades extends Component {
	getGrades = (assignments, categories, projectedAssignments) => {
		var grade = 0
		var projected = 0

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

			var projectedPoints = 0
			var projectedTotal = 0
			projectedAssignments.forEach(assignment => {
				if (assignment.category === category.name) {
					projectedPoints += assignment.score
					projectedTotal += assignment.available
				}
			})

			if (projectedTotal === 0) {
				projected += category.weight
			} else {
				projected += (category.weight * projectedPoints) / projectedTotal
			}
		})

		return {
			grade: (grade * 100).toFixed(1),
			projected: (projected * 100).toFixed(1)
		}
	}

	render() {
		var grades = this.getGrades(
			this.props.assignments,
			this.props.categories,
			this.props.projectedAssignments
		)
		return (
			<div className="final-grades">
				<h1>{grades.grade}</h1>
				{this.props.projectedAssignments.length > 0 && (
					<div>
						<h4 className="highlight">
							{grades.projected - grades.grade > 0
								? '+' + (grades.projected - grades.grade).toFixed(1)
								: (grades.projected - grades.grade).toFixed(1)}
						</h4>
						<h4 className="highlight">
							<span className="unselected">projected:</span> {grades.projected}
						</h4>
					</div>
				)}
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

	handleProjectionChange = change => {
		// TODO: modify this.state, call props handleProjectionChange with new this.state.assignments
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

	resetProjection = () => {}

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
			<div>
				<Textbox
					inputStyle={{ width: '19.4em' }}
					style={{ marginBottom: '1em' }}
					hint="filter"
					onTextChange={this.handleFilterChange}
				/>
				{/* TODO: INSERT ASSIGNMENT CREATION MEME */}
				{shownAssignments.map((assignment, index) => {
					return (
						<Assignment
							key={assignment.name + ' ' + assignment.date}
							// TODO: INCLUDE ASSIGNMENT EDITING MEME
							expanded={this.state.expandedAssignment === index}
							handleClick={() => this.handleClick(index)}
							date={assignment.date}
							name={assignment.name}
							score={assignment.score}
							available={assignment.available}
							category={assignment.category}
							comments={assignment.comments}
						/>
					)
				})}
			</div>
		)
	}
}

class Assignment extends Component {
	constructor(props) {
		super(props)

		this.commentsDiv = React.createRef()
	}

	componentWillReceiveProps(newProps) {
		var expanded = newProps.expanded

		if (expanded) {
			const height = ReactDOM.findDOMNode(
				this.refs.comments
			).getBoundingClientRect().height
			this.commentsDiv.current.style.height = 'calc(' + height + 'px + 3em)'
		} else {
			this.commentsDiv.current.style.height = '0'
		}
	}

	render() {
		return (
			<div className="assignment">
				<div className="assignment-main" onClick={this.props.handleClick}>
					<h5 className="assignment-date">{this.props.date}</h5>
					<svg height="12" width="12" style={{ paddingTop: '0.6em' }}>
						<circle cx="6" cy="6" r="6" fill="#12EB9D" />
					</svg>
					<div className="assignment-info">
						<div className="assignment-name-grade">
							<h4 className="assignment-name">{this.props.name}</h4>
							<h4 className="assignment-grade">
								{((this.props.score / this.props.available) * 100).toFixed(1)}
							</h4>
						</div>
						<div className="assignment-category">
							<h5>{this.props.category}</h5>
							<h5>{this.props.score + '/' + this.props.available}</h5>
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
