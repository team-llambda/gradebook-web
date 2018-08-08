import React, { Component } from 'react'
import { Menu, Logo, Table } from '../Components'
import LoginPage from '../LoginPage'

export default class ClassesPage extends Component {
	render() {
		return (
			<div className="fullsize">
				<Menu currentItemIndex={0} />
				<div className="content">
					<h1>Classes</h1>
					{/* TODO: INSERT QUARTER SELECTOR HERE */}
					<Table
						widths={[4, 12, 12, 4, 4]}
						headers={['Period', 'Class', 'Teacher', 'Room', 'Grade']}
						filter={''}
						data={[
							{
								_id: 'mememe',
								fields: [1, 'AP Calculus', 'Helene Tate', '1106', 95.3]
							},
							{
								_id: 'mememe2',
								fields: [
									2,
									'AP Physics C Mechanics',
									'Casey Appel',
									'3101',
									99.9
								]
							}
						]}
					/>
				</div>
				<Logo />
			</div>
		)
	}
}
