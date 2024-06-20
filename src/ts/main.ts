import { Burger } from './components/burger';
import { Accordion } from './components/accordion';
import { SummerSale } from './main/summer-sale-swiper';
import { Loader } from './modules/stop-preload';
import { ShopSome } from './main/shop-some';
import { ShopFilter } from './main/shop-some-filter';
import { FeaturedSwiper } from './main/featured-items-swiper';
import { PopularSwiper } from './main/most-popular';
import { Blog } from './main/blog';
import { Skeleton } from './components/skeleton';
import { Search } from './components/search';


document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new Search();
  new Accordion();
  new SummerSale(); // done
  new ShopSome(); // done
  new ShopFilter();
  new FeaturedSwiper(); // done
  new PopularSwiper(); // done
  new Blog(); // done
  Loader.stop('brands__item');
  Loader.stop('sales');
  Loader.stop('limits');
  Loader.stop('explore__content');
});

new Skeleton();
