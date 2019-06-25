import React, {Component} from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import {debounce} from 'lodash'
import './Mason.css'
export default class Mason extends Component {

	componentDidMount() {
		new ResizeObserver(() => {
			this.positionChildren()
		}).observe(this.refs.container)
		this.positionChildren()
	}

	positionChildren = () => {
		const container = this.refs.container
		const breakPoint = window.getComputedStyle(container, ':before').getPropertyValue('content').replace(/\"/g, '')
		const columns = +this.props.columns[breakPoint] || +this.props.columns.default || 1
		const columnDebt = new Array(columns).fill(0)
		const children = [].slice.call(this.refs.container.children)

		children.forEach((child, index) => {
			const column = index % columns
			const rowChildren = children.slice(index - column, index - column + columns)
			const maxHeight = Math.max(...rowChildren.map(child => child.offsetHeight))
			const debt = maxHeight - child.offsetHeight
			child.style.transform = index > columns - 1 ? `translateY(${-columnDebt[column]}px)` : ''
			columnDebt[column] = columnDebt[column] + debt
		})

		window.setTimeout(() => {
			const lastChildren = children.slice(Math.max(children.length - columns, 1))
			const childBottomEdge = lastChildren.map(child => {
				const childRect = child.getBoundingClientRect()
				return ((childRect.top + childRect.height))
			})
			container.style.height = (Math.max(...childBottomEdge) - container.getBoundingClientRect().top) + 'px'
		}, 0)
	}

	render() {
		const columns = this.props.columns
		const masonClasses = Object.keys(this.props.columns).map(breakPoint => `mason-columns-${breakPoint}-${columns[breakPoint]}`)
		return <div className={['mason-container', ...masonClasses].join(' ')} ref='container'>
			{this.props.children}
		</div>
	}
}
