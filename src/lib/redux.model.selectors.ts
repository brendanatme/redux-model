/**
 * redux.model.selectors
 *
 * contains helper method
 * for generating selectors
 * for use in model
 */
import { createSelector } from 'reselect';

import { ReduxModelSelectors, ReduxModelState } from './types';

export const generateSelectors = <T>(key: string, itemIdProp: string): ReduxModelSelectors<T> => {
  const getSlice = (state: any): ReduxModelState<T> => state[key];
  const getNetwork = ({ failed, fetched, fetching }: ReduxModelState<T>) => ({ failed, fetched, fetching });
  const getItem = (slice: ReduxModelState<T>): T => (slice as any).item;
  const getItems = (slice: ReduxModelState<T>): T[] => (slice as any).items;
  const getItemMap = (items: T[]) => {
    const output: { [k: string]: T; } = {};
    items.map((item: any) => { output[item[itemIdProp]] = item; });
    return output;
  };
  const getSelectedItem = (slice: ReduxModelState<T>, itemMap: any) => itemMap[slice.selectedId];
  const getNetworkSel = createSelector(getSlice, getNetwork);
  const getItemsSel = createSelector(getSlice, getItems);
  const getItemMapSel = createSelector(getItemsSel, getItemMap);
  const getSelectedItemSel = createSelector(getSlice, getItemMapSel, getSelectedItem);

  return {
    item: createSelector(getSlice, getItem),
    items: getItemsSel,
    itemMap: getItemMapSel,
    network: getNetworkSel,
    selectedItem: getSelectedItemSel,
    state: getSlice,
  };
};
