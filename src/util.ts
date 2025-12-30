import { MasonryConfig, MutationConfiguration } from "./types";

export const mutationConfig = { childList: true, subtree: true } as MutationConfiguration;

const getBreakPoint = (config: MasonryConfig) => {
  const fallBack = Object.keys(config).find((thisBreakPoint) => !config[thisBreakPoint]?.query);
  const matchingPoint = Object.keys(config).find((thisBreakPoint) => {
    const breakpointQuery = config[thisBreakPoint]?.query;
    return breakpointQuery && window.matchMedia(breakpointQuery).matches;
  });

  return matchingPoint || fallBack;
};

export const positionChildren = (targets: HTMLElement[], container: HTMLElement, columnConfig: MasonryConfig): void => {
  // iterate through children - by column.  find gap under each child and the element in the row below it.
  // add the gap to the 'column debt' and move the child vertically accordingly.

  const breakPoint = getBreakPoint(columnConfig);

  if (!breakPoint || !container) return;

  const columns: number = +(columnConfig[breakPoint]?.columns || 1);
  const children: HTMLElement[] = Array.from(container.children) as HTMLElement[];

  // find the first row of items impacted by the reposition, and begin positioning south of there
  const firstTarget = targets.reduce((a, c) => Math.min(a, children.indexOf(c)), children.length);
  const firstTargetRow = Math.max(0, firstTarget - columns);

  children.forEach((child: HTMLElement, index: number) => {
    if (index >= firstTargetRow) {
      const column: number = index % columns;
      const rowChildren: HTMLElement[] = children.slice(index - column, index - column + columns);

      const prevChild = children[index - columns];
      const prevDebt = Number(prevChild?.getAttribute("data-debt") || 0);

      const maxHeight: number = Math.max(...rowChildren.map((rowChild: HTMLElement) => rowChild.getBoundingClientRect().height));
      const debt: number = prevDebt + Math.ceil(maxHeight - child.getBoundingClientRect().height);

      child.setAttribute("data-debt", String(debt));
      child.style.transform = index > columns - 1 ? `translateY(-${prevDebt}px)` : "";
    }
  });

  window.requestAnimationFrame(() => {
    const lastChildren = children.slice(-1 * columns);
    const childBottomEdge = Math.max(...lastChildren.map((c: HTMLElement) => c.getBoundingClientRect().bottom));
    const childTopEdge = children[0]?.getBoundingClientRect().top ?? 0;
    container.style.height = childBottomEdge - childTopEdge + "px";
  });
};
