import { Burger } from './components/burger';
import { Accordion } from './components/accordion';
import { SummerSale } from './main/summer-sale-swiper';
import { Loader } from './modules/stop-preload';
// import { Skeleton } from './components/skeleton';

document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new Accordion();
  new SummerSale();
  Loader.stop();
});

// document.addEventListener('loadingIsFinished', () => {
//   new Skeleton();
// });
