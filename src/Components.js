import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export class LoadingSpinner extends Component {
	render() {
		return <div className={'loading-spinner' + (this.props.on ? ' on' : '')} />
	}
}

export class Logo extends Component {
	render() {
		return <img className="logo" src="../assets/logo.svg" />
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
			this.blocker.current.style.width = 'calc(' + width + 'px - 0.7em)'
		else
			this.blocker.current.style.width =
				'calc(' + (width * 14) / 16 + 'px + 1em)'
	}

	handleBlur = () => {
		if (this.state.text.length === 0) this.blocker.current.style.width = '0em'
	}

	handleChange = e => {
		this.setState({ text: e.target.value })
	}

	render() {
		const style = { ...this.props.style }
		style.marginTop = '1em'
		return (
			<div style={style} className="textbox">
				<input
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

export default class Menu extends Component {
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
