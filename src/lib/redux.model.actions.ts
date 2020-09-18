/**
 * redux.model.actions
 *
 * helper methods to generate actions and action types
 */
import {
  ReduxModelActions,
  ReduxModelActionTypes,
  ReduxModelState,
} from './types';

export const generateActionTypes = (key: string): ReduxModelActionTypes => ({
  BeginFetch: `${key}/BeginFetch`,
  Clear: `${key}/Clear`,
  ClearItem: `${key}/ClearItem`,
  ClearItems: `${key}/ClearItems`,
  DeselectItem: `${key}/DeselectItem`,
  FetchFailure: `${key}/FetchFailure`,
  FetchSuccess: `${key}/FetchSuccess`,
  SelectItem: `${key}/SelectItem`,
  Update: `${key}/Update`,
});

export const generateActions = <T>(actionTypes: ReduxModelActionTypes): ReduxModelActions<T> => ({
  BeginFetch: () => ({ type: actionTypes.BeginFetch }),
  Clear: () => ({ type: actionTypes.Clear }),
  ClearItem: () => ({ type: actionTypes.ClearItem }),
  ClearItems: () => ({ type: actionTypes.ClearItems }),
  DeselectItem: () => ({ type: actionTypes.DeselectItem }),
  FetchFailure: () => ({ type: actionTypes.FetchFailure }),
  FetchSuccess: (payload?: { item?: Partial<T>; items?: Partial<T>[]; }) => ({
    payload,
    type: actionTypes.FetchSuccess,
  }),
  SelectItem: (id: string) => ({ type: actionTypes.SelectItem, payload: id }),
  Update: (payload: Partial<ReduxModelState<T>>) => ({ type: actionTypes.Update, payload }),
});
