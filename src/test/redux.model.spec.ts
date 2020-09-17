import test from 'ava';

import { ReduxModel } from '../lib/redux.model';

const setup = () => new ReduxModel('test');

test('exposes actions', (t) => {
  const model = setup();
  t.truthy(model.actions);
});

test('exposes action types', (t) => {
  const model = setup();
  t.truthy(model.ActionTypes);
});

test('exposes selectors', (t) => {
  const model = setup();
  t.truthy(model.selectors);
});

test('exposes reducer', (t) => {
  const model = setup();
  t.truthy(model.reducer);
});
