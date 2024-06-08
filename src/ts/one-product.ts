import { Burger } from './components/burger';
import { Accordion } from './components/accordion';
import { Loader } from './modules/stop-preload';
import { Skeleton } from './components/skeleton';
import { MainInfoSwiper } from './one-product/main-info-swoper';
import { Calculator } from './one-product/main-info-culc';

document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new Accordion();
  new MainInfoSwiper();
  new Calculator();
  Loader.stop();
});

new Skeleton();
