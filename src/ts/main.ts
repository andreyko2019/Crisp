import { Burger } from './components/burger';
import { Accordion } from './components/accordion';
import { SummerSale } from './main/summer-sale-swiper';

document.addEventListener('DOMContentLoaded', async function () {
  new Burger();
  new Accordion();
  new SummerSale();
});
