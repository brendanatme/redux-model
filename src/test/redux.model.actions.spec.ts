import test from 'ava';

import { generateActions, generateActionTypes } from '../lib/redux.model.actions';

const KEY = 'test';

const setup = () => {
  const ActionTypes = generateActionTypes(KEY);
  const actions = generateActions(ActionTypes);

  return {
    actions,
    ActionTypes,
  };
};

const actionTypeTests = [
  'BeginFetch',
  'Clear',
  'ClearItem',
  'ClearItems',
  'DeselectItem',
  'FetchFailure',
  'FetchSuccess',
  'SelectItem',
  'Update',
];

actionTypeTests.map((att) => {
  test(`generates action type: ${att} using key`, (t) => {
    const { ActionTypes } = setup();
    t.is(ActionTypes[att], `${KEY}/${att}`);
  });
});

const actionTests = [
  { key: 'BeginFetch', args: [] },
  { key: 'Clear', args: [] },
  { key: 'ClearItem', args: [] },
  { key: 'ClearItems', args: [] },
  { key: 'DeselectItem', args: [] },
  { key: 'FetchFailure', args: [] },
  { key: 'FetchSuccess', args: [{ item: { foo: 'bar' } }], payload: { item: { foo: 'bar' } } },
  { key: 'SelectItem', args: ['1'], payload: '1' },
  { key: 'Update', args: [{ fetching: true }], payload: { fetching: true } },
];

actionTests.map((at) => {
  test(`action creator: ${at.key} returns appropriate actions`, (t) => {
    const { actions, ActionTypes } = setup();
    const result: { type: string; payload?: any } = { type: ActionTypes[at.key] };
    if (at.payload) result.payload = at.payload;
    t.deepEqual(actions[at.key](...at.args), result);
  });
});
