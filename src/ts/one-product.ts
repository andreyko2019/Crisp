import { Burger } from './components/burger';
import { Accordion } from './components/accordion';
import { Loader } from './modules/stop-preload';
import { Skeleton } from './components/skeleton';
import { MainInfoSwiper } from './one-product/main-info-swiper';
import { Calculator } from './one-product/main-info-culc';
import { Dropdown } from './one-product/custom-drop-down';
import { MainInfo } from './one-product/main-info-info';
import { LikeSwiper } from './components/you-may-also-like';
import { AddToBag } from './one-product/add-to-bag';
import { Search } from './components/search';

document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new Accordion();
  new AddToBag();
  new MainInfoSwiper();
  new Calculator();
  new Dropdown('.info__sizes');
  new MainInfo();
  new LikeSwiper();
  Loader.stop('more-info');
  new Search();
});

new Skeleton();
