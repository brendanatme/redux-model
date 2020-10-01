import test from 'ava';
import { AnyAction } from 'redux';

import { ReduxModel } from '../lib';

const DoNothing = (state: any, action?: AnyAction) => ({ ...state, item: action });
const DoSomething = () => async () => true;
const itemIdProp = '_id';

const setup = () => {
  const model = new ReduxModel<any>('test', {
    itemIdProp,
    reducers: {
      DoNothing,
    },
  });

  model.addAction('DoSomething', DoSomething);

  return model;
};

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

test('exposes connectors', (t) => {
  const model = setup();
  t.truthy(model.connectors);
});

test('exposes reducer', (t) => {
  const model = setup();
  t.truthy(model.reducer);
});

test('reducer handles BeginFetch', (t) => {
  const model = setup();
  const state1 = { ...model.initialState };
  const state2 = { ...model.initialState, network: { ...model.initialState.network, fetching: true } };
  t.deepEqual(model.reducer(state1, model.actions.BeginFetch()), state2);
});

test('reducer handles Clear', (t) => {
  const model = setup();
  const state1 = { ...model.initialState, foo: 'bar' };
  const state2 = { ...model.initialState };
  t.deepEqual(model.reducer(state1, model.actions.Clear()), state2);
});

test('reducer handles ClearItem', (t) => {
  const model = setup();
  const state1 = { ...model.initialState, item: { foo: 'bar' } };
  const state2 = { ...model.initialState };
  t.deepEqual(model.reducer(state1, model.actions.ClearItem()), state2);
});

test('reducer handles ClearItems', (t) => {
  const model = setup();
  const state1 = { ...model.initialState, items: [{ foo: 'bar' }] };
  const state2 = { ...model.initialState };
  t.deepEqual(model.reducer(state1, model.actions.ClearItems()), state2);
});

test('reducer handles DeselectItem', (t) => {
  const model = setup();
  const state1 = { ...model.initialState, selectedId: '1' };
  const state2 = { ...model.initialState };
  t.deepEqual(model.reducer(state1, model.actions.DeselectItem()), state2);
});

test('reducer handles FetchFailure', (t) => {
  const model = setup();
  const state1 = { ...model.initialState, network: { ...model.initialState.network, fetching: true, failed: false } };
  const state2 = { ...model.initialState, network: { ...model.initialState.network, fetching: false, failed: true } };
  t.deepEqual(model.reducer(state1, model.actions.FetchFailure()), state2);
});

test('reducer handles FetchSuccess', (t) => {
  const model = setup();
  const state1 = { ...model.initialState, network: { ...model.initialState.network, fetching: true, fetched: false } };
  const state2 = { ...model.initialState, network: { ...model.initialState.network, fetching: false, fetched: true }, item: { foo: 'bar' } };
  t.deepEqual(model.reducer(state1, model.actions.FetchSuccess({ item: { foo: 'bar' } })), state2);
});

test('reducer handles SelectItem', (t) => {
  const model = setup();
  const state1 = { ...model.initialState };
  const state2 = { ...model.initialState, selectedId: '1' };
  t.deepEqual(model.reducer(state1, model.actions.SelectItem('1')), state2);
});

test('reducer handles Update', (t) => {
  const model = setup();
  const state1 = { ...model.initialState };
  const state2 = { ...model.initialState, item: { foo: 'bar' } };
  t.deepEqual(model.reducer(state1, model.actions.Update({ item: { foo: 'bar' } })), state2);
});

test('reducer handles custom reducers', (t) => {
  const model = setup();
  const state1 = { ...model.initialState };
  const state2 = { ...model.initialState, item: { type: 'test/DoNothing' } };
  t.deepEqual(model.reducer(state1, { type: 'test/DoNothing' }), state2);
});

test('reducer ignores other actions', (t) => {
  const model = setup();
  const state1 = { ...model.initialState };
  const state2 = { ...model.initialState };
  t.deepEqual(model.reducer(state1, { type: 'foobar' }), state2);
});

test('adds custom actions', (t) => {
  const model = setup();
  t.truthy(model.actions.DoSomething);
});

test('adds custom action types', (t) => {
  const model = setup();
  t.is(model.ActionTypes.DoSomething, `test/DoSomething`);
});

test('accepts itemIdProp', (t) => {
  const model = setup();
  t.is((model as any).itemIdProp, itemIdProp);
});

test('itemIdProp is optional', (t) => {
  const model = new ReduxModel<any>('test');
  t.is((model as any).itemIdProp, 'id');
});

test('accepts initialItem', (t) => {
  const model = new ReduxModel<any>('test', {
    initialItem: { foo: 'bar' },
  });
  t.deepEqual(model.initialState.item, { foo: 'bar' });
});

test('accepts initialItems', (t) => {
  const model = new ReduxModel<any>('test', {
    initialItems: [{ foo: 'bar' }],
  });
  t.deepEqual(model.initialState.items, [{ foo: 'bar' }]);
});
