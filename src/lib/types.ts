export type ReduxModelAction = {
  readonly payload?: any;
  readonly type: string;
}

export type ReduxModelThunk = (...args: any[]) => (dispatch: any, store?: any) => Promise<any>;
export type ReduxModelActionCreator = (...args: any[]) => ReduxModelAction;

export type ReduxModelState<T> = {
  failed: boolean;
  fetched: boolean;
  fetching: boolean;
  item?: T;
  items?: T[],
  selectedId: string;
}

export type ReduxModelReducers<T> = {
  [k: string]: (state: ReduxModelState<T>, action?: ReduxModelAction) => ReduxModelState<T>;
}

export type ReduxModelOptions<T> = {
  readonly initialItem?: T;
  readonly initialItems?: T[];
  readonly itemIdProp?: string;
  readonly reducers?: ReduxModelReducers<T>;
}

export interface ReduxModelActions<T> {
  BeginFetch: () => ReduxModelAction;
  Clear: () => ReduxModelAction;
  ClearItem: () => ReduxModelAction;
  ClearItems: () => ReduxModelAction;
  DeselectItem: () => ReduxModelAction;
  FetchFailure: () => ReduxModelAction;
  FetchSuccess: (payload?: { item?: T; items?: T[]; }) => ReduxModelAction;
  SelectItem: (id: string) => ReduxModelAction;
  Update: (payload: Partial<ReduxModelState<T>>) => ReduxModelAction;
  [k: string]: ReduxModelActionCreator | ReduxModelThunk;
}

export interface ReduxModelSelectors<T> {
  item: (state: any) => T;
  items: (state: any) => T[];
  itemMap: (state: any) => { [k: string]: T; };
  network: (state: any) => { failed: boolean; fetched: boolean; fetching: boolean; };
  selectedItem: (state: any) => T | undefined;
  state: (state: any) => ReduxModelState<T>;
}

export interface ReduxModelActionTypes {
  BeginFetch: string;
  Clear: string;
  ClearItem: string;
  ClearItems: string;
  DeselectItem: string;
  FetchFailure: string;
  FetchSuccess: string;
  SelectItem: string;
  Update: string;
  [k: string]: string;
}
