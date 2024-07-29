import { Burger } from './components/burger';
import { Accordion } from './components/accordeon';
import { SummerSale } from './main/summer-sale-swiper';
import { Loader } from './modules/stop-preload';
import { ShopSome } from './main/shop-some';
import { ShopFilter } from './main/shop-some-filter';
import { FeaturedSwiper } from './main/featured-items-swiper';
import { PopularSwiper } from './main/most-popular';
import { Blog } from './main/blog';
import { Skeleton } from './components/skeleton';
import { Search } from './components/search';
import { AddToBag } from './one-product/add-to-bag';
import { PopupCloser } from './components/pop-up-closer';

document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new Search();
  new AddToBag();
  new Accordion();
  new SummerSale();
  new ShopSome();
  new ShopFilter();
  new FeaturedSwiper();
  new PopularSwiper();
  new Blog();
  new PopupCloser('.buy__bag', '.bag__list');
  Loader.stop('brands__item');
  Loader.stop('sales');
  Loader.stop('limits');
  Loader.stop('explore__content');
});

new Skeleton();
