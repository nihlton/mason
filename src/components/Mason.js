import React, { Component } from 'react';
import { debounce } from 'lodash'


export default class Mason extends Component {
	componentDidMount () {
		let columns = +this.props.columns
		let children = [].slice.call(this.refs.container.children)
		children.forEach(child => {
			child.style.width = `${100 / columns}%`
			child.style.display = 'inline-block'
		})
		
		this.positionChildren()
		
		this.throttledHandler = debounce(this.positionChildren, 100, {leading: false, trailing: true})
		
		window.addEventListener('resize', this.throttledHandler)
		window.addEventListener('orientationchange', this.throttledHandler)
	}
	
	componentWillUnmount () {
		window.removeEventListener('resize', this.throttledHandler)
		window.removeEventListener('orientationchange', this.throttledHandler)
	}
	
	positionChildren = () => {
		let container = this.refs.container
		let columns = +this.props.columns
		let columnDebt = new Array(columns).fill(0)
		let children = [].slice.call(this.refs.container.children)

		children.forEach((child, index) => {
			let column = index % columns
			let rowChildren = children.slice(index - column, index - column + columns)
			let maxHeight = Math.max( ...rowChildren.map(child => child.offsetHeight))
			let debt = maxHeight - child.offsetHeight
			
			if (index > columns - 1) {
				child.style.transform = `translateY(${-columnDebt[column]}px)`
				child.style.content = ''
			}
			columnDebt[column] = columnDebt[column] + debt
		})
		
		// let lastChildren = children.slice(index - column, index - column + columns)
		// let maxHeight = Math.max( ...rowChildren.map(child => child.offsetHeight))
		// container.style.marginBottom = ( -Math.max(...columnDebt)) + 'px'
	}
	
	sizeHandler = () => {
		this.positionChildren()
	}
	
	render () {
		return <div ref='container'>
			{this.props.children}
		</div>
	}
}