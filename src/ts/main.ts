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


document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new Accordion();
  new SummerSale();
  new ShopSome();
  new ShopFilter();
  new FeaturedSwiper();
  new PopularSwiper();
  new Blog();
  Loader.stop();
  

});

new Skeleton();
