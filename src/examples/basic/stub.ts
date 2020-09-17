
export type Product = {
  id: string;
  name: string;
}

export interface Stub {
  '/products': Product[];
  '/products/1': Product;
}

export const data: Stub = {
  '/products': [
    { id: '0', name: 'Product 0' },
    { id: '1', name: 'Product 1' },
    { id: '2', name: 'Product 2' },
  ],
  '/products/1': { id: '1', name: 'Product 1' },
};
