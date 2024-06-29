import { Burger } from './components/burger';
import { Accordion } from './components/accordion';
import { Skeleton } from './components/skeleton';
import { Search } from './components/search';
import { AddToBag } from './one-product/add-to-bag';
import { Tabs } from './components/tabs';
import { CabinetTitle } from './cabinet/cabinet-title';
import { Dashboard } from './cabinet/cabinet-dashboard';
import { AccInfo } from './cabinet/cabinet-account-info';

document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new Search();
  new AddToBag();
  new Accordion();
  new Tabs();
  new CabinetTitle();
  new Dashboard();
  new AccInfo();
});

new Skeleton();
