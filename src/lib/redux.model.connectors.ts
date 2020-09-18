/**
 * redux.model.connectors
 *
 * provide convenience methods
 * for connect properties and methods
 * to a component
 */
import { connect } from 'react-redux';

import { ReduxModelActions, ReduxModelConnectors, ReduxModelSelectors } from './types';

export const stateConnector = <T>(k: string, selectors: ReduxModelSelectors<T>) => (state: any) => ({
  [k]: selectors.state(state),
});

export const generateConnectors = <T>(key: string, actions: ReduxModelActions<T>, selectors: ReduxModelSelectors<T>): ReduxModelConnectors => {
  const withState = connect(stateConnector(key, selectors));
  const withActions = connect(null, actions);
  const withAll = connect(stateConnector, actions);

  return {
    withActions,
    withAll,
    withState,
  };
};
