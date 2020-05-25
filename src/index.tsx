import * as React from 'react'
import ResizeObserver from 'resize-observer-polyfill'

import './index.css'

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

const positionChildren = (targets: HTMLElement[], container: HTMLElement, columnConfig: MasonryConfig): void => {
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
  let children: HTMLElement[] = Array.from(container.children) as HTMLElement[]

  // find the first row of items impacted by the reposition, and begin positioning south of there
  const firstTarget = targets.reduce((a, c) => Math.min(a, children.indexOf(c)), children.length)
  const firstTargetRow = Math.max(0, firstTarget - columns)

  children.forEach((child: HTMLElement, index: number) => {
    if (index >= firstTargetRow) {
      const column: number = index % columns
      const rowChildren: HTMLElement[] = children.slice(index - column, index - column + columns)

      const prevChild: HTMLElement = children[index - columns]
      const prevDebt: number = Number(prevChild?.getAttribute('data-debt') || 0)

      const maxHeight: number = Math.max( ...rowChildren.map((rowChild: HTMLElement) => rowChild.offsetHeight))
      const debt: number = prevDebt + Math.ceil(maxHeight - child.getBoundingClientRect().height)

      child.setAttribute('data-debt', String(debt))
      child.style.transform = index > columns - 1 ? `translateY(-${prevDebt}px)` : ''
    }
  })
  
  window.requestAnimationFrame(() => {
    const lastChildren = children.slice(-1 * (columns))
    const childBottomEdge = Math.max(...lastChildren.map((c: HTMLElement) => c.getBoundingClientRect().bottom))
    const childTopEdge = (children[0]?.getBoundingClientRect().top) ?? 0
    container.style.height = (childBottomEdge  - childTopEdge) + 'px'
  })
}

export default function Mason ({ children = [], columns } : MasonProps) {
  const containerRef = React.useRef<HTMLDivElement>()

  React.useLayoutEffect(() => {
    const containerChildren = Array.from(containerRef.current.children) as HTMLElement[]
    positionChildren(containerChildren, containerRef.current, columns)
  }, [ containerRef, columns ])

  React.useEffect(() => {

    // Listen for mediaQuery matches, and set the number of columns.
    const mqListeners: { [key: string]: MediaQueryList } = {}
    const containerStyle = containerRef.current.style
    
    // handle media query match changes
    const getQueryMatches = (): void => {
      Object.keys(mqListeners).forEach((breakPoint: string) => {
        const containerChildren = Array.from(containerRef.current.children) as HTMLElement[]
        const cellWidth: string = (100 / columns[breakPoint].columns).toFixed(3) + '%'
        if (mqListeners[breakPoint].matches || !columns[breakPoint].query) {
          containerStyle.setProperty('--cell-width', cellWidth)
          window.requestAnimationFrame(() => positionChildren(containerChildren, containerRef.current, columns))
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
    const doPositionChildren = (entries: ResizeObserverEntry[]): void => {
      const containerChildren = Array.from(containerRef.current.children) as HTMLElement[]
      const targets = entries?.length ? entries.map(entry => entry.target)  as HTMLElement[] : containerChildren
      positionChildren(targets, containerNode, columns)
    }

    const containerNode = containerRef.current as HTMLElement
    const sizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => { doPositionChildren(entries) })

    Array.from(containerRef.current.children).forEach(child => sizeObserver.observe(child))
    sizeObserver.observe(containerNode)
    
    return () => { sizeObserver.disconnect() }
  }, [containerRef, columns])
  
  
  return <div className={'mason-container'} ref={containerRef}>
    {React.Children.toArray(children).filter(c => c).map((child: React.ReactNode, i: number) => <div key={`child-${i}`}>{child}</div>)}
  </div>
}
