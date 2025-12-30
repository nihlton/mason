export interface MutationConfiguration {
  childList: boolean;
  subtree: boolean;
}

export interface BreakPointData {
  query?: string;
  columns: number;
}

export interface MasonryConfig {
  [key: string]: BreakPointData;
}

export interface MasonProps {
  children?: React.ReactNode[] | undefined;
  columns: MasonryConfig;
  style?: React.CSSProperties;
}

export type entryWithTarget = {
  target: Node;
};
