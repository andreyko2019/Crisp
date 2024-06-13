import { Burger } from './components/burger';
import { Accordion } from './components/accordion';
import { Loader } from './modules/stop-preload';
import { Skeleton } from './components/skeleton';
import { MainInfoSwiper } from './one-product/main-info-swiper';
import { Calculator } from './one-product/main-info-culc';
import { Dropdown } from './components/custom-drop-down';
import { MainInfo } from './one-product/main-info-info';

document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new Accordion();
  new MainInfoSwiper();
  new Calculator();
  new Dropdown('.info__sizes');
  new MainInfo();
  Loader.stop();
});

new Skeleton();
