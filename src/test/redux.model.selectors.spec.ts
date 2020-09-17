import test from 'ava';

import { generateSelectors } from '../lib/redux.model.selectors';

const KEY = 'test';
const ID = 'id';
const ITEM = {};
const ITEMS: { id: string; }[] = [
  { [ID]: '1' },
  { [ID]: '2' },
];
const SLICE = {
  failed: false,
  fetched: false,
  fetching: false,
  item: ITEM,
  items: ITEMS,
  selectedId: '',
};
const MAPPED = {
  '1': ITEMS[0],
  '2': ITEMS[1],
};

const setup = () => ({
  selectors: generateSelectors(KEY, ID),
  state: {
    [KEY]: SLICE,
  },
  selectItem: (id: string) => { SLICE.selectedId = id; },
});

test('selectors.state gets slice of state', (t) => {
  const { selectors, state } = setup();
  t.is(selectors.state(state), SLICE);
});

test('selectors.item gets state.item', (t) => {
  const { selectors, state } = setup();
  t.is(selectors.item(state), ITEM);
});

test('selectors.items gets state.items', (t) => {
  const { selectors, state } = setup();
  t.is(selectors.items(state), ITEMS);
});

test('selectors.itemMap gets state.items mapped by id', (t) => {
  const { selectors, state } = setup();
  t.deepEqual(selectors.itemMap(state), MAPPED);
});

test('selectors.selectedItem gets selected item after selection', (t) => {
  const { selectItem, selectors, state } = setup();
  selectItem('1');
  t.deepEqual(selectors.selectedItem(state), ITEMS[0]);
  selectItem('');
});
