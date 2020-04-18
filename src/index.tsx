import * as React from 'react'
import ResizeObserver from 'resize-observer-polyfill'

import './index.css'

interface BreakPointData {
  query?: string,
  columns: number
}

interface ResponsiveConfig {
  [key: string]: BreakPointData
}

const positionChildren = (container: HTMLElement, columnConfig: ResponsiveConfig): void => {
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
  
  children.forEach((child: HTMLElement, index: number) => {
    let column = index % columns
    let rowChildren = children.slice(index - column, index - column + columns)
    let maxHeight = Math.max( ...rowChildren.map((rowChild: HTMLElement) => rowChild.offsetHeight))
    let debt = maxHeight - child.offsetHeight
    
    child.style.transform = index > columns - 1 ? `translateY(${-columnDebt[column]}px)` : ''
    columnDebt[column] = columnDebt[column] + debt
  })
  
  window.requestAnimationFrame(() => {
    let lastChildren = children.slice(-1 * (columns))
    let childBottomEdge = lastChildren.map((child: HTMLElement) => child.getBoundingClientRect().bottom)
    let childTopEdge = (children[0] && children[0].getBoundingClientRect().top) || 0
    container.style.height = (Math.max(...childBottomEdge)  - childTopEdge) + 'px'
  })
}

export default function Mason ({ children, columns } : { children: any, columns: ResponsiveConfig }) {
  const containerRef = React.useRef()
  
  React.useEffect(() => {

    // Listen for mediaQuery matches, and set the number of columns.
    const mqListeners = {} as { [key: string]: any }
    const containerStyle = (containerRef.current as HTMLElement).style
    
    // handle media query match changes
    const getQueryMatches = (): void => {
      Object.keys(mqListeners).forEach(breakPoint => {
        const cellWidth = (100 / columns[breakPoint].columns).toFixed(3) + '%'
        if (mqListeners[breakPoint].matches || !columns[breakPoint].query) {
          containerStyle.setProperty('--cell-width', cellWidth)
          window.requestAnimationFrame(() => positionChildren(containerRef.current, columns))
        }
      })
    }
  
    // listen for query matches, attach listener
    Object.keys(columns).forEach((breakPoint: string) => {
      mqListeners[breakPoint] = window.matchMedia(columns[breakPoint].query)
      mqListeners[breakPoint].addListener(getQueryMatches)
      getQueryMatches()
    })
    
    return () => {
      // stop listening for query matches, and set number of columns
      Object.keys(mqListeners).forEach(breakPoint => mqListeners[breakPoint].removeListener(getQueryMatches))
    }
  }, [ columns, containerRef ])

  React.useEffect(() => {
    // listen for document resizing, and dom tree changes.  recalculate transforms as needed.
    const doPositionChildren = () => positionChildren(containerNode, columns)
    const mutationConfig = { childList: true, subtree: true } as { childList: boolean, subtree: boolean }
    const containerNode = containerRef.current as HTMLElement
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
    {children.map((child: any, i: number) => <div key={`child-${i}`}>{child}</div>)}
  </div>
}
