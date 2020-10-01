import test from 'ava';

import { configureStore } from '../lib/configure-store';
import { ReduxModel } from '../lib/redux.model';

const setup = () => {
  const model = new ReduxModel('test');
  const initStore = configureStore<any>({
    [model.key]: model.reducer,
  });

  return initStore();
};

test('configureStore returns a function which returns a store with dispatch', (t) => {
  const store = setup();
  t.truthy(store.dispatch);
});

test('configureStore returns a function which returns a store with getState', (t) => {
  const store = setup();
  t.truthy(store.getState);
});
