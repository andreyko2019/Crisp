import { Burger } from './components/burger';
import { Accordion } from './components/accordion';
import { loadCards } from './catalog/loadcards';
import { FilterAccordeon } from './catalog/accordeon';


document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new Accordion();
  new FilterAccordeon();
  loadCards();
});
