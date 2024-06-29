import { Burger } from './components/burger';
import { Accordion } from './components/accordion';
import { Skeleton } from './components/skeleton';
import { SignUpFormValidator } from './sign-up/sign-up-validate';
import { AddToBag } from './one-product/add-to-bag';

document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new AddToBag();
  new Accordion();
  new SignUpFormValidator();
});

new Skeleton();
