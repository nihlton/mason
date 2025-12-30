import * as React from "react";

import { mutationConfig, positionChildren } from "./util";
import { entryWithTarget, MasonProps } from "./types";

import "./react-stone-mason.css";

export default function Mason({ children = [], columns, style = {} }: MasonProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (!containerRef.current) return;
    const containerChildren = Array.from(containerRef.current.children) as HTMLElement[];
    positionChildren(containerChildren, containerRef.current, columns);
  }, [containerRef, columns]);

  React.useEffect(() => {
    // Listen for mediaQuery matches, and set the number of columns.
    if (!containerRef.current) return;

    const queryListeners: { [key: string]: MediaQueryList } = {};
    const containerStyle = containerRef.current.style;

    // handle media query match changes
    const getQueryMatches = (): void => {
      Object.keys(columns).forEach((thisPoint: string) => {
        const container = containerRef.current;
        const breakPointColumns = columns[thisPoint];
        const queryListener = queryListeners[thisPoint];

        if (!container || !breakPointColumns) return;

        const containerChildren = Array.from(container.children) as HTMLElement[];
        const cellWidth: string = (100 / breakPointColumns.columns).toFixed(3) + "%";

        if (queryListener?.matches || !breakPointColumns.query) {
          containerStyle.setProperty("--cell-width", cellWidth);
          window.requestAnimationFrame(() => positionChildren(containerChildren, container, columns));
        }
      });
    };

    // listen for query matches, attach listener
    Object.keys(columns).forEach((thisPoint: string) => {
      const pointColumns = columns[thisPoint];
      if (!pointColumns || !pointColumns.query) return;
      queryListeners[thisPoint] = window.matchMedia(pointColumns.query);
      queryListeners[thisPoint].addEventListener("change", getQueryMatches);
    });

    getQueryMatches();

    return () => {
      // stop listening for query matches
      Object.keys(queryListeners).forEach((breakPoint) => queryListeners[breakPoint]?.removeEventListener("change", getQueryMatches));
    };
  }, [columns, containerRef]);

  React.useEffect(() => {
    // listen for document resizing, and dom tree changes.  recalculate transforms as needed.
    if (!containerRef.current) return;

    const doPositionChildren = (entries: entryWithTarget[]): void => {
      if (!containerRef.current) return;

      const containerChildren = Array.from(containerRef.current.children) as HTMLElement[];
      const targets = entries?.length ? (entries.map((entry) => entry.target) as HTMLElement[]) : containerChildren;
      positionChildren(targets, containerNode, columns);
    };

    const containerNode = containerRef.current as HTMLElement;
    const sizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      doPositionChildren(entries);
    });
    const domObserver = new MutationObserver((entries: MutationRecord[]) => {
      doPositionChildren(entries);
    });

    Array.from(containerRef.current.children).forEach((child) => sizeObserver.observe(child));
    sizeObserver.observe(containerNode);
    domObserver.observe(containerNode, mutationConfig);

    return () => {
      sizeObserver.disconnect();
      domObserver.disconnect();
    };
  }, [containerRef, columns]);

  return (
    <div className={"mason-container"} ref={containerRef} style={style}>
      {React.Children.toArray(children)
        .filter((c) => c)
        .map((child: React.ReactNode, i: number) => (
          <div key={`child-${i}`}>{child}</div>
        ))}
    </div>
  );
}
