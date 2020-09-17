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
}

test('generates action types using key', (t) => {
  const { ActionTypes } = setup();
  t.is(ActionTypes.BeginFetch, `${KEY}/BeginFetch`);
});

test('action creators return actions', (t) => {
  const { actions, ActionTypes } = setup();
  t.deepEqual(actions.BeginFetch(), { type: ActionTypes.BeginFetch });
});
