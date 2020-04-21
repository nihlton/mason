import * as React from 'react'
import ResizeObserver from 'resize-observer-polyfill'

import './index.css'

interface MutationConfiguration {
  childList: boolean,
  subtree: boolean
}

interface BreakPointData {
  query?: string,
  columns: number
}

interface MasonryConfig {
  [key: string]: BreakPointData
}

export interface MasonProps {
  children?: React.ReactNode[] | undefined,
  columns: MasonryConfig
}

const positionChildren = (container: HTMLElement, columnConfig: MasonryConfig): void => {
  // iterate through children - by column.  find gap under each child and the element in the row below it.
  // add the gap to the 'column debt' and move the child vertically accordingly.
  
  if (!container) { return }
  let breakPoint: string

  Object.keys(columnConfig).forEach(thisBreakPoint => {
    const defaultValue = !columnConfig[thisBreakPoint].query
    const matchesThisBreakPoint = window.matchMedia(columnConfig[thisBreakPoint].query).matches
    if (matchesThisBreakPoint || defaultValue) { breakPoint = thisBreakPoint }
  })
  
  if (!breakPoint) { return }
  let columns: number = +columnConfig[breakPoint].columns || 1
  let columnDebt: number[] = new Array(columns).fill(0)
  let children: HTMLElement[] = [].slice.call(container.children)
  
  children.forEach((child: HTMLElement, index: number) => {
    let column: number = index % columns
    let rowChildren: HTMLElement[] = children.slice(index - column, index - column + columns)
    let maxHeight: number = Math.max( ...rowChildren.map((rowChild: HTMLElement) => rowChild.offsetHeight))
    let debt: number = Math.ceil(maxHeight - child.getBoundingClientRect().height)

    child.style.transform = index > columns - 1 ? `translateY(${-columnDebt[column]}px)` : ''
    columnDebt[column] = columnDebt[column] + debt
  })
  
  window.requestAnimationFrame(() => {
    let lastChildren: HTMLElement[] = children.slice(-1 * (columns))
    let childBottomEdge: number = Math.max(...lastChildren.map((c: HTMLElement) => c.getBoundingClientRect().bottom))
    let childTopEdge: number = (children[0] && children[0].getBoundingClientRect().top) || 0
    container.style.height = (childBottomEdge  - childTopEdge) + 'px'
  })
}

export default function Mason ({ children, columns } : MasonProps) {
  const containerRef = React.useRef<HTMLDivElement>()
  
  React.useEffect(() => {

    // Listen for mediaQuery matches, and set the number of columns.
    const mqListeners = {} as { [key: string]: any }
    const containerStyle = containerRef.current.style
    
    // handle media query match changes
    const getQueryMatches = (): void => {
      Object.keys(mqListeners).forEach((breakPoint: string) => {
        const cellWidth: string = (100 / columns[breakPoint].columns).toFixed(3) + '%'
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
    const doPositionChildren = (): void => positionChildren(containerNode, columns)
    const mutationConfig = { childList: true, subtree: true } as MutationConfiguration
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
    {children.map((child: React.ReactNode, i: number) => <div key={`child-${i}`}>{child}</div>)}
  </div>
}
