import React, { Component } from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import { debounce } from 'lodash'

import './Mason.css'

export default class Mason extends Component {
	componentDidMount () {
		new ResizeObserver(() => {this.positionChildren()}).observe(this.refs.container)
        this.positionChildren()
	}
	
	positionChildren = () => {
		let container = this.refs.container
        let breakPoint = window.getComputedStyle(container, ':before').getPropertyValue('content').replace(/\"/g, '')
		let columns = +this.props.columns[breakPoint] || +this.props.columns.default || 1
		let columnDebt = new Array(columns).fill(0)
		let children = [].slice.call(this.refs.container.children)

		children.forEach((child, index) => {
			let column = index % columns
			let rowChildren = children.slice(index - column, index - column + columns)
			let maxHeight = Math.max( ...rowChildren.map(child => child.offsetHeight))
			let debt = maxHeight - child.offsetHeight
			
			child.style.transform = index > columns - 1 ? `translateY(${-columnDebt[column]}px)` : ''
			columnDebt[column] = columnDebt[column] + debt
		})

		window.setTimeout(() => {
            let lastChildren = children.slice(Math.max(children.length - columns, 1))
            let childBottomEdge = lastChildren.map(child => {
            	let childRect = child.getBoundingClientRect()
            	return ((childRect.top + childRect.height))
            })
            let containerHeight =  (Math.max(...childBottomEdge)  - container.getBoundingClientRect().top) + 'px'

            container.style.height = containerHeight
		}, 0)
	}
	
	render () {
		let masonClasses = Object.keys(this.props.columns).map(breakPoint => `mason-columns-${breakPoint}-${this.props.columns[breakPoint]}`)

		return <div className={['mason-container', ...masonClasses].join(' ')} ref='container'>
			{this.props.children}
		</div>
	}
}