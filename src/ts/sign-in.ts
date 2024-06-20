import { Burger } from './components/burger';
import { Accordion } from './components/accordion';
import { Skeleton } from './components/skeleton';
import { SignInFormValidator } from './sign-in/sign-in-validate';

document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new Accordion();
  new SignInFormValidator();
});

new Skeleton();
