import { Burger } from './components/burger';
import { Accordion } from './components/accordeon';
import { Skeleton } from './components/skeleton';
import { SignUpFormValidator } from './sign-up/sign-up-validate';
import { AddToBag } from './one-product/add-to-bag';
import { Search } from './components/search';
import { PopupCloser } from './components/pop-up-closer';

document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new AddToBag();
  new Accordion();
  new SignUpFormValidator();
  new Search();
  new PopupCloser('.buy__bag', '.bag__list');
});

new Skeleton();
