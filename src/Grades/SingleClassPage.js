import React, { Component } from 'react'
import { Logo, Menu, QuarterSelector } from '../Components'

export default class SingleClassPage extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	componentDidMount() {
		const { period } = this.props.match.params

		this.setState({ period: period })
	}

	render() {
		return (
			<div className="fullsize">
				<Menu currentItemIndex={0} />
				<div className="content">
					<h1>Period {this.state.period}</h1>
				</div>
				<QuarterSelector />
				<Logo />
			</div>
		)
	}
}
