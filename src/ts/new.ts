import { Burger } from './components/burger';
import { Accordion } from './components/accordion';
import { SummerSale } from './main/summer-sale-swiper';
import { Loader } from './modules/stop-preload';
import { PopularSwiper } from './main/most-popular';
import { NewBaner } from './new/new-baner';
import { NewInfo } from './new/new-info';

document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new Accordion();
  new SummerSale();
  new PopularSwiper();
  new NewBaner();
  new NewInfo();
  Loader.stop();
});
