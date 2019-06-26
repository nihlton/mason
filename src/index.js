import React, { Component } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

import './index.css'

const nodesToArray = (nodeList) => Array.prototype.slice.call(nodeList)

export default class Index extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      visibleRows: this.props.visibleRows || 3
    }
  }
  
  scrollToPagination = () => {
    this.refs.pagination.scrollIntoView({ behavior: 'smooth' })
  }
  
  showMore = () => {
    this.setState({ visibleRows: this.state.visibleRows + (this.props.visibleRows || 3) }, this.scrollToPagination)
  }
  
  componentWillReceiveProps (nextProps) {
    if (nextProps.layout !== this.props.layout) {
      this.setState = ({ visibleRows: this.props.visibleRows })
    }
  }
  
  componentDidMount () {
    this.resizeObserver = new ResizeObserver(() => { this.positionChildren() })
    this.resizeObserver.observe(this.refs.container)
    
    window.setTimeout(() => window.requestAnimationFrame(() => {
      this.positionChildren()
      this.listenForImages()
    }, 0))
  }
  
  componentDidUpdate () {
    this.positionChildren()
    this.listenForImages()
  }
  
  loadListener = () => {
    this.positionChildren()
  }
  
  listenForImages = () => {
    const images = nodesToArray(this.refs.container.getElementsByTagName('img'))
    
    images.forEach(img => {
      !img.complete && img.addEventListener('load', this.loadListener)
      !img.complete && img.addEventListener('error', this.loadListener)
    })
  }
  
  componentWillUnmount = () => {
    const images = nodesToArray(this.refs.container.getElementsByTagName('img'))
    images.forEach(img => {
      img.removeEventListener('load', this.loadListener)
      img.removeEventListener('error', this.loadListener)
    })
    this.resizeObserver.disconnect()
  }
  
  positionChildren = () => {
    const defaultColumns = +this.props.columns || 1
    const defaultBreakPoint = { breakpoint: Infinity, columns: defaultColumns }
    const breakPoints = (this.props.responsive || [ defaultBreakPoint ]).sort((a, b) => b.breakpoint - a.breakpoint)
    const container = this.refs.container
    const containerRect = container && container.getBoundingClientRect()
    const containerWidth = containerRect && containerRect.width
    const breakPoint = breakPoints.reduce((a, c) => containerWidth < c.breakpoint && c.breakpoint < a.breakpoint ? c : a, defaultBreakPoint)
    const columns = +breakPoint.columns
    const columnDebt = new Array(columns).fill(0)
    const children = [].slice.call(this.refs.container.children)
    
    container.setAttribute('class', `mason-container mason-columns-${columns}`)
    
    if (columns === 1) {
      children.forEach(child => (child.style.transform = 'none'))
      container.style.height = 'auto'
      return
    }
    
    children.forEach((child, index) => {
      const column = index % columns
      const rowChildren = children.slice(index - column, index - column + columns)
      const maxHeight = Math.max(...rowChildren.map(child => child.offsetHeight))
      const debt = maxHeight - child.offsetHeight
      child.style.transform = index > columns - 1 ? `translateY(${-columnDebt[column]}px)` : ''
      columnDebt[column] = columnDebt[column] + debt
    })
    
    window.requestAnimationFrame(() => {
      const itemsPerRow = (columns) || 1
      const numToShow = this.state.visibleRows * itemsPerRow
      const items = this.props.children
      const lastChildren = children.slice(Math.max(children.length - columns, 1))
      const childBottomEdge = lastChildren.map(child => {
        const childRect = child.getBoundingClientRect()
        return ((childRect.top + childRect.height))
      })
      const fullHeight = (Math.max(...childBottomEdge) - container.getBoundingClientRect().top) + 'px'
      const truncateHeight = (Math.min(...childBottomEdge) - container.getBoundingClientRect().top) + 'px'
      container.style.height = items.length > numToShow ? truncateHeight : fullHeight
    })
  }
  
  render () {
    const itemsPerRow = this.props.columns || 1
    const numToShow = this.state.visibleRows * itemsPerRow
    const items = this.props.children
    const allItemsVisible = items.length > numToShow
    const defaultButton = <button tabIndex='0' onClick={this.showMore} className='mason-button' >show more</button>
    const providedButton = this.props.showMoreButton && React.cloneElement(this.props.showMoreButton, {onClick: this.showMore()} )
    const showMoreButton = providedButton || defaultButton
    
    return <div className={`${allItemsVisible ? 'mask' : ''}`}>
      <div key='container' className={`mason-container`}  ref='container'>
        {this.props.children.slice(0, numToShow)}
      </div>
      <div key='pagination' ref='pagination' className='pagination-controls small-12 text-center'>
        {allItemsVisible && showMoreButton}
      </div>
    </div>
  }
}