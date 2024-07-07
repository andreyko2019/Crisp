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
  {
    name: 'catalog',
    path: resolve(__dirname, 'catalog.html'),
  },
  {
    name: 'sign-in',
    path: resolve(__dirname, 'sign-in.html'),
  },
  {
    name: 'sign-up',
    path: resolve(__dirname, 'sign-up.html'),
  },
  {
    name: 'cabinet',
    path: resolve(__dirname, 'cabinet.html'),
  },
];

export default pages;
