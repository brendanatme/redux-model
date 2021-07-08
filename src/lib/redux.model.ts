/**
 * redux.model
 *
 * a type-safe class for generating a redux-based model
 * complete with:
 *
 * - async action creators
 * - action types
 * - reducer
 * - selectors
 *
 * handle network requests and data structure in an opinionated way
 * by using the built-in actions:
 *
 * - BeginFetch() sets state.fetching to true
 * - Clear() resets state
 * - ClearItem() resets state.item
 * - ClearItems() resets state.items
 * - DeselectItem() resets selected item
 * - FetchSuccess(items?, item?) sets state.fetching to false, sets state.fetched to true, optionally sets item and items
 * - FetchFailure() sets state.fetching to false, sets state.failed to true
 * - SelectItem(id) sets selected item from state.items (get access with selector: model.selectors.selectedItem)
 * - Update(state) escape hatch to manually update state as you see fit
 *
 * + any custom actions you want to define
 *
 * you can also customize the model by adding your own custom:
 * - initial state
 * - reducer methods
 * - async action creators
 */
import { AnyAction } from 'redux';

import { generateActions, generateActionTypes } from './redux.model.actions';
import { generateConnectors } from './redux.model.connectors';
import { generateSelectors } from './redux.model.selectors';
import {
  ReduxModelActionCreator,
  ReduxModelActions,
  ReduxModelActionTypes,
  ReduxModelConnectors,
  ReduxModelNetworkState,
  ReduxModelOptions,
  ReduxModelReducers,
  ReduxModelSelectors,
  ReduxModelState,
  ReduxModelThunk,
} from './types';

export class ReduxModel<T> {
  private itemIdProp = 'id';
  private reducerKeys: string[] = [];

  actions: ReduxModelActions<T>;
  ActionTypes: ReduxModelActionTypes;
  connectors: ReduxModelConnectors;
  initialState: ReduxModelState<T> = {
    networkState: ReduxModelNetworkState.idle,
    item: {},
    items: [],
    selectedId: '',
  };
  key: string;
  reducers: any = {};
  selectors: ReduxModelSelectors<T>;

  constructor(key: string, options?: ReduxModelOptions<T>) {
    this.key = key;
    (this.initialState as any).item = {};

    this.ActionTypes = generateActionTypes(this.key);
    this.actions = generateActions<T>(this.ActionTypes);
    this.selectors = generateSelectors<T>(this.key, this.itemIdProp);
    this.connectors = generateConnectors<T>(this.key, this.actions, this.selectors);

    this.itemIdProp = options && options.itemIdProp || this.itemIdProp;

    if (options && options.reducers) {
      this.initUserReducers(options.reducers);
    }

    if (options && (options.initialItem || options.initialItems)) {
      this.initUserItems(options.initialItems, options.initialItem);
    }
  }

  private initUserReducers(reducers: ReduxModelReducers<T>) {
    this.reducerKeys = Object.keys(reducers).map((k) => {
      const publicKey = `${this.key}/${k}`;
      this.reducers[publicKey] = reducers[k];
      this.ActionTypes[k] = publicKey;
      return publicKey;
    });
  }

  private initUserItems(items?: Partial<T>[], item?: Partial<T>) {
    this.initialState.item = item || this.initialState.item;
    this.initialState.items = items || this.initialState.items;
  }

  addAction(key: string, actionCreator: ReduxModelActionCreator | ReduxModelThunk) {
    this.actions[key] = actionCreator;
    this.ActionTypes[key] = `${this.key}/${key}`;
  }

  reducer = (state = this.initialState, action: AnyAction): ReduxModelState<T> => {
    for (let i = 0, len = this.reducerKeys.length; i < len; i++) {
      const reducerKey = this.reducerKeys[i];
      if (reducerKey === action.type) {
        return this.reducers[reducerKey](state, action);
      }
    }

    switch (action.type) {
      case this.ActionTypes.BeginFetch: {
        return {
          ...state,
          networkState: ReduxModelNetworkState.fetching,
        };
      }
      case this.ActionTypes.Clear: {
        return {
          item: {},
          items: [],
          networkState: ReduxModelNetworkState.idle,
          selectedId: '',
        };
      }
      case this.ActionTypes.ClearItem: {
        return {
          ...state,
          item: {},
        };
      }
      case this.ActionTypes.ClearItems: {
        return {
          ...state,
          items: [],
        };
      }
      case this.ActionTypes.DeselectItem: {
        return {
          ...state,
          selectedId: '',
        };
      }
      case this.ActionTypes.FetchFailure: {
        return {
          ...state,
          networkState: ReduxModelNetworkState.failed,
        };
      }
      case this.ActionTypes.FetchSuccess: {
        return {
          ...state,
          item: {
            ...state.item,
            ...action.payload.item,
          },
          items: action.payload.items || state.items,
          networkState: ReduxModelNetworkState.fetched,
        };
      }
      case this.ActionTypes.SelectItem: {
        return {
          ...state,
          selectedId: action.payload,
        };
      }
      case this.ActionTypes.Update: {
        return {
          ...state,
          ...action.payload,
          item: {
            ...state.item,
            ...action.payload.item,
          },
          items: action.payload.items || state.items,
        };
      }
      default: {
        return state;
      }
    }
  };
}
