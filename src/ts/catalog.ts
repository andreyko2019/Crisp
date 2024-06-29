import { Burger } from './components/burger';
import { Accordion } from './components/accordion';
import { Loader } from './modules/stop-preload';
// import { dropdownWork } from './catalog/dropdown';
// import { loadShowenBrands } from './catalog/accordeon';
import { loadCards } from './catalog/loadcards';
import { FilterAccordeon } from './catalog/accordeon';
// import { rangeSliderWork } from './catalog/range-slider';

document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new Accordion();
  Loader.stop();
  new FilterAccordeon();
  // dropdownWork();
  loadCards();
  // loadShowenBrands();
  // rangeSliderWork();
});
