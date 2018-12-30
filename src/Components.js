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
			<div className="logowrapper">
				<img alt="logo" className="logo" src="../assets/logo.svg" />
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
				{/* <LoadingSpinner on={this.state.loading} /> */}
			</div>
		)
	}
}

export class Textbox extends Component {
	constructor(props) {
		super(props)

		this.state = { errored: false, text: this.props.text || '' }
		this.blocker = React.createRef()
	}

	componentDidMount() {
		setTimeout(() => {
			const label = ReactDOM.findDOMNode(this.refs.label)
			if (label) {
				const width = label.getBoundingClientRect().width

				// 1em is the total latteral padding of the white blocker, 0.5em for each side
				if (this.state.text.length > 0)
					this.blocker.current.style.width = 'calc(' + width + 'px + 1em)'
			}
		}, 500)
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
		// 1.25 is the ratio of the large placeholder font size to the small placeholder font size
		const width = ReactDOM.findDOMNode(this.refs.label).getBoundingClientRect()
			.width
		if (this.state.text.length === 0)
			this.blocker.current.style.width = 'calc(' + width / 1.25 + 'px + 1em)'
	}

	handleBlur = () => {
		if (this.state.text.length === 0) this.blocker.current.style.width = '0em'
	}

	handleChange = e => {
		if (this.props.onTextChange) this.props.onTextChange(e.target.value)
		this.setState({ text: e.target.value })
	}

	handleKeyPress = e => {
		if (e.charCode === 13 && this.props.onEnter) {
			this.props.onEnter()
		}
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
					onKeyPress={this.handleKeyPress}
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
					key={item.text}
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
					{this.state.sortIndex === index && this.state.sortDirection === 1 && (
						<i className="material-icons tablesort">arrow_drop_down</i>
					)}
					{this.state.sortIndex === index &&
						this.state.sortDirection === -1 && (
							<i className="material-icons tablesort">arrow_drop_up</i>
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
					if (isNaN(a.fields[sortIndex])) {
						return (
							sortDirection *
							a.fields[sortIndex].toString().localeCompare(b.fields[sortIndex])
						)
					} else {
						return sortDirection * (a.fields[sortIndex] - b.fields[sortIndex])
					}
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
				return null
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
					if (isNaN(a.fields[sortIndex])) {
						return (
							sortDirection *
							a.fields[sortIndex].toString().localeCompare(b.fields[sortIndex])
						)
					} else {
						return sortDirection * (a.fields[sortIndex] - b.fields[sortIndex])
					}
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

		// this.props.handleQuarterChange()
	}

	render() {
		return (
			<div className="quarter-selector">
				<h1>Quarter</h1>
				{/* eslint-disable-next-line */}
				<a
					onClick={() => {
						this.handleQuarterChange(1)
					}}
					className={this.state.quarter === 1 ? 'highlight' : ''}>
					1
				</a>
				{/* eslint-disable-next-line */}
				<a
					onClick={() => {
						this.handleQuarterChange(2)
					}}
					className={this.state.quarter === 2 ? 'highlight' : ''}>
					2
				</a>
				{/* eslint-disable-next-line */}
				<a
					onClick={() => {
						this.handleQuarterChange(3)
					}}
					className={this.state.quarter === 3 ? 'highlight' : ''}>
					3
				</a>
				{/* eslint-disable-next-line */}
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

export class EditableInput extends Component {
	constructor(props) {
		super(props)

		this.state = {
			editing: false,
			value: this.props.value
		}

		// this.input = React.createRef()
	}

	enableEditing = () => {
		this.setState({ editing: true }, () => {
			this.input.focus()
		})
	}

	disableEditing = () => {
		this.setState({ editing: false })
	}

	handleSave = () => {
		this.setState({ editing: false })
		this.props.handleChange(this.state.value)
	}

	handleChange = e => {
		if (!this.state.editing) return
		if (!e) return
		var raw = e.target.value

		if (isNaN(raw)) return
		this.setState({ value: raw })
	}

	componentWillReceiveProps(newProps) {
		this.setState({ value: newProps.value })
	}

	render() {
		return (
			<div style={{ display: 'inline' }}>
				{this.state.editing ? (
					<input
						onKeyPress={e => {
							if (e.charCode === 13) {
								this.handleSave()
							}
						}}
						ref={input => {
							this.input = input
						}}
						className={'editable-input enabled ' + this.props.className}
						value={this.state.value}
						onChange={this.handleChange}
						onBlur={this.disableEditing}
						style={this.props.highlight ? { color: '#527aff' } : {}}
					/>
				) : (
					<h4
						className={'editable-input ' + this.props.className}
						style={this.props.highlight ? { color: '#527aff' } : {}}
						onClick={this.enableEditing}>
						{this.state.value}
					</h4>
				)}
			</div>
		)
	}
}

export class Dropdown extends Component {
	constructor(props) {
		super(props)

		this.state = {
			open: false,
			selectedIndex: this.props.selectedIndex
		}
	}

	render() {
		return (
			<div>
				<h5
					onClick={() => this.setState({ open: !this.state.open })}
					className={this.props.className}
					style={{ cursor: 'pointer' }}>
					{this.props.items[this.state.selectedIndex]}
				</h5>
				<ul
					className="dropdown-list"
					style={!this.state.open ? { display: 'none' } : {}}>
					{this.props.items.map((i, index) => {
						if (index === this.state.selectedIndex)
							return (
								<li key={i} className="highlight">
									{i}
								</li>
							)
						else return <li key={i}>{i}</li>
					})}
				</ul>
			</div>
		)
	}
}
