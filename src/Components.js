import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export class LoadingSpinner extends Component {
	render() {
		return <div className={'loading-spinner' + (this.props.on ? ' on' : '')} />
	}
}

export class Logo extends Component {
	render() {
		return (
			<div style={{ position: 'absolute', left: '50%', bottom: '2em' }}>
				<img className="logo" src="../assets/logo.svg" />
			</div>
		)
	}
}

export class Button extends Component {
	constructor(props) {
		super(props)

		this.state = { errored: false, loading: false }
	}

	setLoading(loading) {
		this.setState({ loading: loading })
	}

	setErrored(errored) {
		this.setState({ errored: errored })
	}

	getLoading() {
		return this.state.loading
	}

	getErrored() {
		return this.state.errored
	}

	handleClick = () => {
		// if you wants the button to start loading immediately, then set loading to true
		if (this.props.triggerLoadOnClick) {
			this.setState({ loading: true })
		}

		// if you pass in an onClick prop, call it
		if (this.props.onClick) this.props.onClick()
	}

	render() {
		return (
			<div
				style={this.props.style}
				onClick={this.handleClick}
				className="button">
				{this.props.text}
				<LoadingSpinner on={this.state.loading} />
			</div>
		)
	}
}

export class Textbox extends Component {
	constructor(props) {
		super(props)

		this.state = { errored: false, text: this.props.text || '' }
		this.blocker = React.createRef()

		setTimeout(() => {
			const width = ReactDOM.findDOMNode(
				this.refs.label
			).getBoundingClientRect().width
			if (this.state.text.length > 0)
				this.blocker.current.style.width = 'calc(' + width + 'px - 0.7em)'
		}, 200)
	}

	setText(text) {
		this.setState({ text: text })
	}

	setErrored(errored) {
		this.setState({ errored: errored })
	}

	getText() {
		return this.state.text
	}

	getErrored() {
		return this.state.errored
	}

	handleFocus = () => {
		const width = ReactDOM.findDOMNode(this.refs.label).getBoundingClientRect()
			.width
		if (this.state.text.length > 0)
			this.blocker.current.style.width = 'calc(' + width + 'px - 0.8em)'
		else
			this.blocker.current.style.width =
				'calc(' + (width * 14) / 20 + 'px + 0.95em)'
	}

	handleBlur = () => {
		if (this.state.text.length === 0) this.blocker.current.style.width = '0em'
	}

	handleChange = e => {
		if (this.props.onTextChange) this.props.onTextChange(e.target.value)
		this.setState({ text: e.target.value })
	}

	render() {
		const style = { ...this.props.style }
		style.marginTop = '1em'
		return (
			<div style={style} className="textbox">
				<input
					style={this.props.inputStyle}
					onFocus={this.handleFocus}
					onBlur={this.handleBlur}
					type={this.props.type || 'text'}
					className="inputText"
					onChange={this.handleChange}
					required
				/>
				<span ref="label" className="floating-label">
					{this.props.hint}
				</span>
				<div ref={this.blocker} className="blocker" />
			</div>
		)
	}
}

const MenuItems = [
	{ text: 'Grades', href: '/classes' },
	{ text: 'Chat', href: '/chat' },
	{ text: 'Settings', href: '/settings' },
	{ text: 'Logout', href: '/logout' }
]

export class Menu extends Component {
	constructor(props) {
		super(props)
		this.state = {
			open: false
		}
	}
	render() {
		const links = MenuItems.map((item, index) => {
			return (
				<a
					href={item.href}
					className={this.props.currentItemIndex === index ? 'highlight' : ''}>
					<h2>{item.text}</h2>
				</a>
			)
		})
		return (
			<div className={'sidebar' + (this.state.open ? ' open' : '')}>
				<div className={'menu-content' + (this.state.open ? ' open' : '')}>
					<h1>Menu</h1>
					{links}
				</div>
				<i
					className="material-icons menu"
					onClick={() => {
						this.setState({ open: !this.state.open })
					}}>
					menu
				</i>
			</div>
		)
	}
}

export class Table extends Component {
	constructor(props) {
		super(props)

		this.state = {
			sortIndex: null,
			sortDirection: null
		}
	}

	toggleSortByIndex = index => {
		const currentSortIndex = this.state.sortIndex
		const currentSortDirection = this.state.sortDirection

		// toggle order: sort ascending, sort descending, sort off
		if (index === currentSortIndex) {
			if (currentSortDirection === 1) {
				this.setState({ sortDirection: -1 })
				return
			} else if (currentSortDirection === -1) {
				this.setState({ sortIndex: null, sortDirection: null })
				return
			}
		} else {
			this.setState({ sortIndex: index, sortDirection: 1 })
		}
	}

	render() {
		var widths = this.props.widths || this.props.headers.map(_ => 0)
		var headers = this.props.headers.map((header, index) => {
			return (
				<th
					style={widths[index] > 0 ? { width: widths[index] + 'em' } : {}}
					key={header}
					onClick={() => this.toggleSortByIndex(index)}>
					{header}
					{this.state.sortIndex === index &&
						this.state.sortDirection === 1 && (
							<i
								className="material-icons"
								style={{ color: '#000', position: 'absolute', top: '37%' }}>
								arrow_drop_down
							</i>
						)}
					{this.state.sortIndex === index &&
						this.state.sortDirection === -1 && (
							<i
								className="material-icons"
								style={{ color: '#000', position: 'absolute', top: '37%' }}>
								arrow_drop_up
							</i>
						)}
				</th>
			)
		})

		var rows
		if (this.props.filter.length > 0) {
			const data = this.props.data.slice()

			const sortIndex = this.state.sortIndex
			const sortDirection = this.state.sortDirection
			if (
				data.length > 0 &&
				sortIndex != null &&
				sortDirection != null &&
				!isNaN(sortIndex) &&
				!isNaN(sortDirection) &&
				sortIndex >= 0 &&
				sortIndex < data[0].fields.length
			) {
				data.sort((a, b) => {
					return (
						sortDirection *
						a.fields[sortIndex].toString().localeCompare(b.fields[sortIndex])
					)
				})
			}

			rows = data.slice().map(row => {
				for (var i = 0; i < row.fields.length; i++) {
					if (!row.fields[i]) continue
					if (
						row.fields[i]
							.toString()
							.toLowerCase()
							.includes(this.props.filter.toLowerCase())
					) {
						return (
							<tr
								key={row._id}
								onClick={() => {
									if (this.props.onItemClick) this.props.onItemClick(row._id)
								}}>
								{row.fields.map((item, index) => {
									return <td hey={index}>{item}</td>
								})}
							</tr>
						)
					}
				}
			})
		} else {
			const data = this.props.data.slice()

			const sortIndex = this.state.sortIndex
			const sortDirection = this.state.sortDirection
			if (
				data.length > 0 &&
				sortIndex != null &&
				sortDirection != null &&
				!isNaN(sortIndex) &&
				!isNaN(sortDirection) &&
				sortIndex >= 0 &&
				sortIndex < data[0].fields.length
			) {
				data.sort((a, b) => {
					if (!a.fields[sortIndex]) return 1
					return (
						sortDirection *
						a.fields[sortIndex].toString().localeCompare(b.fields[sortIndex])
					)
				})
			}

			rows = data.slice().map(row => {
				return (
					<tr
						key={row._id}
						onClick={() => {
							if (this.props.onItemClick) this.props.onItemClick(row._id)
						}}>
						{row.fields.map((item, index) => {
							return <td key={index}>{item}</td>
						})}
					</tr>
				)
			})
		}

		return (
			<table>
				<thead>
					<tr>{headers}</tr>
				</thead>
				<tbody>{rows}</tbody>
			</table>
		)
	}
}

export class QuarterSelector extends Component {
	constructor(props) {
		super(props)

		this.state = {
			quarter: this.props.quarter || 1
		}
	}

	componentWillReceiveProps(newProps) {
		this.setState({ quarter: this.props.quarter || 1 })
	}

	handleQuarterChange = quarter => {
		if (quarter === this.state.quarter) return

		this.setState({ quarter: quarter })

		this.props.handleQuarterChange()
	}

	render() {
		return (
			<div className="quarter-selector">
				<h1 style={{ display: 'inline-block' }}>Quarter</h1>
				<a
					onClick={() => {
						this.handleQuarterChange(1)
					}}
					className={this.state.quarter === 1 ? 'highlight' : ''}>
					1
				</a>
				<a
					onClick={() => {
						this.handleQuarterChange(2)
					}}
					className={this.state.quarter === 2 ? 'highlight' : ''}>
					2
				</a>
				<a
					onClick={() => {
						this.handleQuarterChange(3)
					}}
					className={this.state.quarter === 3 ? 'highlight' : ''}>
					3
				</a>
				<a
					onClick={() => {
						this.handleQuarterChange(4)
					}}
					className={this.state.quarter === 4 ? 'highlight' : ''}>
					4
				</a>
			</div>
		)
	}
}

export class CourseInfoPane extends Component {
	constructor(props) {
		super(props)

		this.state = {
			page: 'assignments'
		}
	}

	render() {
		return (
			<div className="course-info-pane">
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between'
					}}>
					<h3 className={this.state.page === 'assignments' ? 'highlight' : ''}>
						Assignments
					</h3>
					<h3 className={this.state.page === 'categories' ? 'highlight' : ''}>
						Categories
					</h3>
				</div>

				{this.state.page === 'assignments' && (
					<AssignmentsPane assignments={this.props.assignments} />
				)}

				{this.state.page === 'categories' && (
					<CategoriesPane categories={this.props.categories} />
				)}

				<FinalGrades />
			</div>
		)
	}
}
export class FinalGrades extends Component {
	render() {
		return (
			<div
				style={{
					position: 'absolute',
					bottom: '4em',
					right: '0',
					textAlign: 'right'
				}}>
				<h1>99.9</h1>
				<h4 style={{ color: '#527aff', fontWeight: 'bold' }}>-6.6</h4>
				<h4 style={{ color: '#527aff', fontWeight: 'bold' }}>
					<k style={{ color: '#cccccc' }}>projected:</k> 93.3
				</h4>
			</div>
		)
	}
}

export class AssignmentsPane extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filter: '',
			assignments: this.props.assignments || []
		}
	}

	componentWillReceiveProps(newProps) {
		this.setState({ assignments: newProps.assignments })
	}

	handleFilterChange = text => {
		console.log('filter change')
		this.setState({ filter: text })
	}

	render() {
		var filter = this.state.filter
		var shownAssignments = this.state.assignments.slice().filter(
			a =>
				a.name.toLowerCase().includes(filter.toLowerCase()) ||
				a.grade
					.toString()
					.toLowerCase()
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
					hint="Filter"
					onTextChange={this.handleFilterChange}
				/>
				{/* TODO: INSERT ASSIGNMENT CREATION MEME */}
				{shownAssignments.map(assignment => {
					console.log(assignment)
					return (
						<Assignment
							date={assignment.date}
							name={assignment.name}
							grade={assignment.grade}
							category={assignment.category}
							comments={assignment.comments}
						/>
					)
				})}
			</div>
		)
	}
}

export class Assignment extends Component {
	render() {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'top'
				}}>
				<h5
					style={{
						display: 'inline-block',
						paddingTop: '0.2em',
						width: '4em'
					}}>
					{this.props.date}
				</h5>
				<svg height="12" width="12" style={{ paddingTop: '0.6em' }}>
					<circle cx="6" cy="6" r="6" fill="#12EB9D" />
				</svg>
				<div style={{ display: 'inline-block' }}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							width: '22em'
						}}>
						<h4 style={{ display: 'block', paddingRight: '0.5em' }}>
							{this.props.name}
						</h4>
						<h4 style={{ display: 'block' }}>{this.props.grade.toFixed(1)}</h4>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							width: '20em'
						}}>
						<h5 style={{ display: 'block' }}>{this.props.category}</h5>
					</div>
				</div>
			</div>
		)
	}
}

export class CategoriesPane extends Component {}
