import { resolve } from 'path';

const pages = [
  {
    name: 'index',
    path: resolve(__dirname, 'index.html'),
  },
  {
    name: 'one-product',
    path: resolve(__dirname, 'one-product.html'),
  },
  {
    name: 'new',
    path: resolve(__dirname, 'new.html'),
  },
];

export default pages;
