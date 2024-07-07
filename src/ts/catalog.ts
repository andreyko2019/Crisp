import { Burger } from './components/burger';
import { Accordion } from './components/accordion';
import { loadCards } from './catalog/loadcards';
import { FilterAccordeon } from './catalog/accordeon';
import { Search } from './components/search';

document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new Accordion();
  new FilterAccordeon();
  loadCards();
  new Search();
});
