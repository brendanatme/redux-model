/**
 * examples/basic
 *
 * see a basic implementation of redux-model
 */
import { ReduxModel } from '../../lib';

import * as api from './api';
import { Product } from './stub';

const productModel = new ReduxModel<Product>('products');

productModel.addAction('FetchAll', () => async (dispatch: any) => {
  dispatch(productModel.actions.BeginFetch());

  try {
    const products = await api.get<Product[]>('/products');
    dispatch(productModel.actions.FetchSuccess({ items: products }));
  } catch (e) {
    dispatch(productModel.actions.FetchFailure());
  }
});

// productModel.actions.FetchAll()

productModel.addAction('FetchOne', (id: string) => async (dispatch: any) => {
  dispatch(productModel.actions.BeginFetch());

  try {
    const product = await api.get<Product>(`/products/${id}`);
    dispatch(productModel.actions.FetchSuccess({ item: product }));
  } catch (e) {
    dispatch(productModel.actions.FetchFailure());
  }
});

// productModel.actions.Fetch('1')

// productModel.reducer

export default productModel;
