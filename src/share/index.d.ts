/* history */
export interface CreateUniversalHistoryProps {
  initialEntries?: any[];
}
export interface CreateUniversalHistoryType {
  (props?: CreateUniversalHistoryProps): any;
}

/* delay */
export interface Cancel {
  (key: string): void;
}
export interface Delay {
  <T>(time: number, action: () => T, key?: string): Promise<T | void>;
}
export interface TimeoutMap {
  [props: string]: Array<NodeJS.Timeout | void>;
}
export interface ResolveMap {
  [props: string]: Array<(() => void) | void>;
}
export interface KeyMap {
  [props: string]: number;
}
/* action */
export interface ActionHandlerType {
  <T, K, V>(state: T | void, action: (T) => K, otherAction?: () => V): K | V | void;
}
