import { Burger } from './components/burger';
import { Accordion } from './components/accordeon';
import { Skeleton } from './components/skeleton';
import { Search } from './components/search';
import { AddToBag } from './one-product/add-to-bag';
import { Tabs } from './components/tabs';
import { CabinetTitle } from './cabinet/cabinet-title';
import { Dashboard } from './cabinet/cabinet-dashboard';
import { AccInfo } from './cabinet/cabinet-account-info';
import { DropdownTabs } from './cabinet/drop-down-tabs';
import { Redirect } from './cabinet/cabinet-redirect';
import { DropdownForm } from './cabinet/cabinet-drop-down-form';
import { AddressValidate } from './cabinet/cabinet-address-validate';
import { ContactUs } from './components/contact-us';
import { RenderWishlistCards } from './cabinet/cabinet-load-wishlist';
import { PopupCloser } from './components/pop-up-closer';
import { AddToBagFromWishlist } from './cabinet/add-to-bag-from.wishlist';

document.addEventListener('DOMContentLoaded', async () => {
  initCabinetJS()
  window.addEventListener('hashchange', () => initCabinetJS());
});

function initCabinetJS() {
  new Redirect();
  new Burger();
  new Search();
  new AddToBag();
  new Accordion();
  new Tabs();
  new CabinetTitle();
  new Dashboard();
  new AccInfo();
  new DropdownTabs('.drop-down__select', '.tabs');
  new DropdownForm('.drop-down#country .drop-down__select', '.drop-down#country .drop-down__list');
  new DropdownForm('.drop-down#state .drop-down__select', '.drop-down#state .drop-down__list');
  new AddressValidate();
  new ContactUs('.contact-us__btn', '.contact-us');
  new RenderWishlistCards();
  new PopupCloser('.buy__bag', '.bag__list');
  new AddToBagFromWishlist();
}

new Skeleton();
