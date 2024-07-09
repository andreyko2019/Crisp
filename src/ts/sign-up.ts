import { Burger } from './components/burger';
import { Accordion } from './components/accordeon';
import { Skeleton } from './components/skeleton';
import { SignUpFormValidator } from './sign-up/sign-up-validate';
import { AddToBag } from './one-product/add-to-bag';
import { Search } from './components/search';

document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new AddToBag();
  new Accordion();
  new SignUpFormValidator();
  new Search();
});

new Skeleton();
