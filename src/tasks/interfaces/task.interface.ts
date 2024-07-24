export interface Task {
  name: string;
  command: string;
  requires?: string[];
  dependencies?: number;
}
