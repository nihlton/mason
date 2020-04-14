import React, { useEffect, useRef } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

import './index.css'

const positionChildren = (container, columnConfig) => {
  // iterate through children - by column.  find gap under each child and the element in the row below it.
  // add the gap to the 'column debt' and move the child vertically accordingly.
  
  if (!container) { return }
  let breakPoint
  
  Object.keys(columnConfig).forEach(thisBreakPoint => {
    const defaultValue = !columnConfig[thisBreakPoint].query
    const matchesThisBreakPoint = window.matchMedia(columnConfig[thisBreakPoint].query).matches
    if (matchesThisBreakPoint || defaultValue) { breakPoint = thisBreakPoint }
  })
  
  if (!breakPoint) { return }
  let columns = +columnConfig[breakPoint].columns || 1
  let columnDebt = new Array(columns).fill(0)
  let children = [].slice.call(container.children)
  
  children.forEach((child, index) => {
    let column = index % columns
    let rowChildren = children.slice(index - column, index - column + columns)
    let maxHeight = Math.max( ...rowChildren.map(child => child.offsetHeight))
    let debt = maxHeight - child.offsetHeight
    
    child.style.transform = index > columns - 1 ? `translateY(${-columnDebt[column]}px)` : ''
    columnDebt[column] = columnDebt[column] + debt
  })
  
  window.requestAnimationFrame(() => {
    let lastChildren = children.slice(Math.max(children.length - columns, 1))
    let childBottomEdge = lastChildren.map(child => {
      let childRect = child.getBoundingClientRect()
      return ((childRect.top + childRect.height))
    })
    container.style.height = (Math.max(...childBottomEdge)  - container.getBoundingClientRect().top) + 'px'
  })
}

export default function Mason (props) {
  const containerRef = useRef()
  const columns = props.columns
  
  useEffect(() => {
    // Listen for mediaQuery matches, and set the number of columns.
    const mqListeners = {}
    const containerStyle = containerRef.current.style
    
    // handle media query match changes
    const getQueryMatches = () => {
      Object.keys(mqListeners).forEach(breakPoint => {
        const cellWidth = (100 / columns[breakPoint].columns).toFixed(3) + '%'
        if (mqListeners[breakPoint].matches || !columns[breakPoint].query) {
          containerStyle.setProperty('--cell-width', cellWidth)
          window.requestAnimationFrame(() => positionChildren(containerRef.current, columns))
        }
      })
    }
  
    // listen for query matches, attach listener
    Object.keys(columns).forEach(breakPoint => {
      mqListeners[breakPoint] = window.matchMedia(columns[breakPoint].query)
      mqListeners[breakPoint].addListener(getQueryMatches)
      getQueryMatches()
    })
    
    return () => {
      // stop listening for query matches, and set number of columns
      Object.keys(mqListeners).forEach(breakPoint => mqListeners[breakPoint].removeListener(getQueryMatches))
    }
  }, [ columns, containerRef ])
  
  useEffect(() => {
    // listen for document resizing, and dom tree changes.  recalculate transforms as needed.
    const doPositionChildren = () => positionChildren(containerNode, columns)
    const mutationConfig = { childList: true, subtree: true }
    const containerNode = containerRef.current
    const sizeObserver = new ResizeObserver(() => { doPositionChildren() })
    const domObserver = new MutationObserver(() => { doPositionChildren() })
    containerNode.addEventListener('load', doPositionChildren, true)
    containerNode.addEventListener('error', doPositionChildren, true)
  
    sizeObserver.observe(containerNode)
    domObserver.observe(containerNode, mutationConfig)
    
    doPositionChildren()
    
    return () => {
      sizeObserver.disconnect()
      domObserver.disconnect()
      containerNode.removeEventListener('load', doPositionChildren)
      containerNode.removeEventListener('error', doPositionChildren)
    }
  }, [containerRef, columns])
  
  
  return <div className={'mason-container'} ref={containerRef}>
    {props.children}
  </div>
}
