import { Action, AnyAction, PreloadedState, Store } from 'redux';

export type ReduxModelThunk = <S, A extends Action = AnyAction>(...args: any[]) => (dispatch: any, store?: Store<S, A>) => Promise<any>;
export type ReduxModelActionCreator = (...args: any[]) => AnyAction;

export type ReduxModelState<T> = {
  item?: Partial<T>;
  items?: Partial<T>[],
  network: {
    failed: boolean;
    fetched: boolean;
    fetching: boolean;
  };
  selectedId: string;
}

export type ReduxModelReducers<T> = {
  [k: string]: (state: ReduxModelState<T>, action?: AnyAction) => ReduxModelState<T>;
}

export type ReduxModelOptions<T> = {
  readonly initialItem?: Partial<T>;
  readonly initialItems?: Partial<T>[];
  readonly itemIdProp?: string;
  readonly reducers?: ReduxModelReducers<T>;
}

export interface ReduxModelActions<T> {
  BeginFetch: () => AnyAction;
  Clear: () => AnyAction;
  ClearItem: () => AnyAction;
  ClearItems: () => AnyAction;
  DeselectItem: () => AnyAction;
  FetchFailure: () => AnyAction;
  FetchSuccess: (payload?: { item?: Partial<T>; items?: Partial<T>[]; }) => AnyAction;
  SelectItem: (id: string) => AnyAction;
  Update: (payload: Partial<ReduxModelState<T>>) => AnyAction;
  [k: string]: ReduxModelActionCreator | ReduxModelThunk;
}

export interface ReduxModelSelectors<T> {
  item: (state: any) => Partial<T>;
  items: (state: any) => Partial<T>[];
  itemMap: (state: any) => { [k: string]: Partial<T>; };
  network: (state: any) => { failed: boolean; fetched: boolean; fetching: boolean; };
  selectedItem: (state: any) => Partial<T> | undefined;
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

// @todo properly type
export type ReduxModelComponent = (props: any) => any;

export interface ReduxModelConnectors {
  withActions: (Composed: ReduxModelComponent) => { WrappedComponent: ReduxModelComponent };
  withAll: (Composed: ReduxModelComponent) => { WrappedComponent: ReduxModelComponent };
  withState: (Composed: ReduxModelComponent) => { WrappedComponent: ReduxModelComponent };
}

export type ReduxModelStoreCreator<S, A extends Action = AnyAction> = (initialState?: PreloadedState<S>) => Store<S, A>;
