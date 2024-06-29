import { Burger } from './components/burger';
import { Accordion } from './components/accordion';
import { Skeleton } from './components/skeleton';
import { SignUpFormValidator } from './sign-up/sign-up-validate';

document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new Accordion();
  new SignUpFormValidator();
});

new Skeleton();
