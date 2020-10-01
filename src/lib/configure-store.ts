import {
  Action,
  AnyAction,
  applyMiddleware,
  combineReducers,
  createStore,
  Middleware,
  PreloadedState,
  ReducersMapObject,
  Store,
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import { ReduxModelStoreCreator } from './types';

/**
 * configureStore
 *
 * configure store reducers, initial state (optional) and middlewares (optional)
 *
 * @returns a function that accepts an initial state and return a store
 */
export const configureStore = <S, A extends Action = AnyAction>(
  reducerMap: ReducersMapObject,
  initialState?: PreloadedState<S>,
  middlewares: Middleware[] = [],
): ReduxModelStoreCreator<S, A> => (initState?: PreloadedState<S>): Store<S, A> => createStore(
  combineReducers<S, A>(reducerMap),
  { ...initialState, ...initState } as PreloadedState<S>,
  composeWithDevTools(
    applyMiddleware(thunkMiddleware, ...middlewares),
  ),
);
