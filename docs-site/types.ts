
export interface NavItem {
  label: string;
  path: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface TocItem {
  id: string;
  label: string;
  level: number;
}
