# redux-model

Max your redux, scrap your boilerplate

# Installing

```bash
$ npm install --save @brendanatme/redux-model
```

# Usage

```javascript
// your model code
import { ReduxModel } from '@brendanatme/redux-model';
import * as api from '../my-api';

const productModel = new ReduxModel('products');

productModel.addAction('FetchById', (id) => async (dispatch) => {
  dispatch(productModel.actions.BeginFetch());

  try {
    const item = await api.get(`/products/${id}`);
    dispatch(productModel.actions.FetchSuccess({ item }));
  } catch (e) {
    dispatch(productModel.actions.FetchFailure());
  }
});

export default products;

```

```javascript
// your redux store startup code
import { configureStore } from '@brendanatme/redux-model';
import productModel from '../my/model/above';

const initStore = configureStore({
  [productModel.key]: productModel.reducer,
});

```

```javascript
// your React component code
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import productModel from '../my/model/above';

export default ({ id }) => {
  const dispatch = useDispatch();
  const product = useSelector(productModel.selectors.item);
  const network = useSelector(productModel.selectors.network);

  useEffect(() => {
    dispatch(productModel.actions.FetchById(id));
  }, [product]);

  if (network.fetching) {
    return <Loader />;
  }

  if (network.failed) {
    return <Error />;
  }

  return (
    <code>{JSON.stringify(product)}</code>
  );
};

```
