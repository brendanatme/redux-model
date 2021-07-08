import test from 'ava';

import { ReduxModelNetworkState } from '../lib';
import { generateActions, generateActionTypes } from '../lib/redux.model.actions';
import { generateConnectors, stateConnector } from '../lib/redux.model.connectors';
import { generateSelectors } from '../lib/redux.model.selectors';

const KEY = 'test';
const ID = 'id';
const BAR = 'bar';
const PROPS = { foo: BAR };
const ITEM = {};
const ITEMS: {}[] = [{}, {}];
const SLICE = {
  item: ITEM,
  items: ITEMS,
  networkState: ReduxModelNetworkState.idle,
  selectedId: '',
};
const GLOBAL_STATE = { [KEY]: SLICE };
const Component = (props: any) => props.foo;

const setup = () => {
  const ActionTypes = generateActionTypes(KEY);
  const actions = generateActions(ActionTypes);
  const selectors = generateSelectors(KEY, ID);

  return {
    connectors: generateConnectors<any>(KEY, actions, selectors),
    mapStateToProps: stateConnector<any>(KEY, selectors),
  };
};

test('exposes connectors.withAll decorator', (t) => {
  const { connectors } = setup();
  const wrapped = connectors.withAll(Component);
  t.deepEqual(wrapped.WrappedComponent(PROPS), BAR);
});

test('exposes connectors.withActions decorator', (t) => {
  const { connectors } = setup();
  const wrapped = connectors.withActions(Component);
  t.deepEqual(wrapped.WrappedComponent(PROPS), BAR);
});

test('exposes connectors.withState decorator', (t) => {
  const { connectors } = setup();
  const wrapped = connectors.withState(Component);
  t.deepEqual(wrapped.WrappedComponent(PROPS), BAR);
});

test('stateConnector returns state at key', (t) => {
  const { mapStateToProps } = setup();
  t.deepEqual(mapStateToProps(GLOBAL_STATE), GLOBAL_STATE);
});
