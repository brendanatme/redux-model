# Redux-model

Max your redux, scrap your boilerplate

Redux-model is an opinionated layer built on top of Redux designed to cut out your boilerplate, encourage structure and best practices, and give powerful features from line zero. Throw out all those folders and files full of action types, action creators, selectors, effects, and reducers... and create simple models that do what you always want them to by default, while retaining all the flexibility of redux.

## Installing

```bash
$ npm install --save @brendanatme/redux-model
```

## Usage

```javascript
// your model code
import { ReduxModel } from "@brendanatme/redux-model";
import * as api from "../my-api";

const productModel = new ReduxModel("products");

// define action creators as thunks or simple action creators
productModel.addAction("FetchById", (id) => async (dispatch) => {
  // leverage pre-existing built-in action creators
  dispatch(productModel.actions.BeginFetch());

  try {
    const item = await api.get(`/products/${id}`);

    // follow data-shape conventions to make your life easier,
    // and your code more consistent and readable
    dispatch(productModel.actions.FetchSuccess({ item }));
  } catch (e) {
    // redux-model gives you the tools that make following best-practices,
    // like proper network status handling,
    // quite trivial
    dispatch(productModel.actions.FetchFailure());
  }
});

export default productModel;
```

```javascript
// your redux store startup code
import { configureStore } from "@brendanatme/redux-model";
import productModel from "../my/model/above";

const initStore = configureStore(
  {
    [productModel.key]: productModel.reducer,
  }
  // {}, // (optional) initial state
  // [], // (optional) redux middlewares
);

// call this function to initialize your store
export default initStore;
```

```javascript
// your React component code
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import productModel from "../my/model/above";

export default ({ id }) => {
  const dispatch = useDispatch();

  // use built-in selectors to access data consistently
  // without needing to write or repeat procedural code
  const product = useSelector(productModel.selectors.item);
  const network = useSelector(productModel.selectors.network);

  useEffect(() => {
    dispatch(productModel.actions.FetchById(id));
  }, [id]);

  if (network === "fetching") {
    return <Loader />;
  }

  if (network === "failed") {
    return <Error />;
  }

  return <code>{JSON.stringify(product)}</code>;
};
```

## Docs

### Model-based approach

Models contain a key, a reducer, action types, action creators, selectors, and connectors. To instantiate a model, you only need to provide the key:

```javascript
import { ReduxModel } from "@brendanatme/redux-model";

const productModel = new ReduxModel("products");
```

You can optionally add your own reducers:

```javascript
import { ReduxModel } from "@brendanatme/redux-model";

const productModel = new ReduxModel("products", {
  reducers: {
    Foo: (state, action) => ({ ...state, ...action.payload }),
  },
});
```

You can access action types associated with your created reducers:

```javascript
import { ReduxModel } from "@brendanatme/redux-model";

const productModel = new ReduxModel("products", {
  reducers: {
    Foo: (state, action) => ({ ...state, ...action.payload }),
  },
});

console.log(productModel.ActionTypes.Foo); // --> 'products/Foo'
console.log(productModel.ActionTypes.Bar); // --> undefined
```

You can also add your own action creators; types will be created for those as well.

```javascript
import { ReduxModel } from "@brendanatme/redux-model";

const productModel = new ReduxModel("products", {
  reducers: {
    Foo: (state, action) => ({ ...state, ...action.payload }),
  },
});

productModel.addAction("Bar", async (dispatch) => {
  dispatch({ type: productModel.ActionTypes.Foo, payload: "baz" });
});

console.log(productModel.ActionTypes.Foo); // --> 'products/Foo'
console.log(productModel.ActionTypes.Bar); // --> 'products/Bar'
```

Next, we'll talk about the out-of-the-box actions redux-model provides,
and the default, opinionated way, it handles state.

### Opinionated state handling

Redux-model provides a number of actions to make commonplace tasks like fetching data and selecting items easy, consistent, and robust. Take fetching a resource, for example:

```javascript
import { ReduxModel } from "@brendanatme/redux-model";
import * as api from "../my-api";

const productModel = new ReduxModel("products");

productModel.addAction("FetchById", (id) => async (dispatch) => {
  // initiate the BeginFetch() action
  // this sets our model's network state as such:
  // state.network = { failed: false, fetched: false, fetching: true }
  dispatch(productModel.actions.BeginFetch());

  try {
    const item = await api.get(`/products/${id}`);

    // when we successfully receive a response,
    // we can initiate the FetchSuccess() action
    // to a) update our network state: state.network = { failed: false, fetched: true, fetching: false }
    // and b) update our data state, using the 'item' key for a single resource or the 'items' key for an array
    dispatch(productModel.actions.FetchSuccess({ item }));
  } catch (e) {
    // if our request fails,
    // we can use the FetchFailure() built-in action creator
    // to update our network state to:
    // state.network = { failed: true, fetched: false, fetching: false }
    dispatch(productModel.actions.FetchFailure());
  }
});

// we now have access to the action type as well as the action creator:
console.log(productModel.ActionTypes.FetchById); // --> 'products/FetchById'
console.log(productModel.actions.FetchById); // --> function

// usage:
dispatch(productModel.actions.FetchById("f49wjto"));
```

### Setting Model State

The best way to put data into your model state is by using the `FetchSuccess` method. This is because redux-model assumes you're loading your data from somewhere else, and so the `FetchSuccess` action will also automatically update your network status. The `FetchSuccess` method accepts an object for an argument with a key of `item`, or `items`, or both:

```javascript
// ...

dispatch(productModel.actions.FetchSuccess({

  // for a singular resource
  item: {
    foo: 'bar',
  },

  // for an array of items
  items: [
    { id: 'f5soghl24', name: 'Product A' },
    { id: 'f5soghl25', name: 'Product B' },
  ],

});

```

Setting your data this way will give you easy access to it elsewhere with redux-model's built-in selectors, and will also give you added built-in functionality such as easily selecting an item from your array:

```javascript
// get all items
const items = useSelector(productModel.selectors.items);

// ...

// set the selectedItem (using an id from objects within the 'items' array)
dispatch(productModel.actions.SelectItem("f5soghl25"));

// ...

// access the 'selectedItem'
const selectedItem = useSelector(productModel.selectors.selectedItem);
```

### Escape Hatch

If you can't follow the convention, or just plain don't want to, you can use the `Update()` action creator as an escape hatch to set your state however you want:

```javascript
// ...

// set a custom property
dispatch(productModel.actions.Update({ foo: "bar" }));

// ...

// get the model's entire state
const { foo } = useSelector(productModel.selectors.state);
```
