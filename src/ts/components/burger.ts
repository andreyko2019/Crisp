import { getElement } from '../composables/useCallDom';

export class Burger {
  burgerBtn: HTMLElement;
  menuAdapt: HTMLElement;
  search: HTMLElement;
  searchBtn: HTMLElement;

  constructor() {
    this.burgerBtn = getElement('.burger-btn') as HTMLElement;
    this.menuAdapt = getElement('.header__menu_adapt') as HTMLElement;
    this.search = getElement('.header__search-and-bag .search') as HTMLElement;
    this.searchBtn = getElement('.header__search-and-bag .search svg') as HTMLElement;

    this.burger();
    this.searchFunc();
  }

  burger(): void {
    const context = this;

    this.burgerBtn.addEventListener('click', function () {
      context.burgerBtn.classList.toggle('active');
      context.menuAdapt.classList.toggle('active');
    });
  }

  searchFunc(): void {
    const context = this;

    this.searchBtn.addEventListener('click', function () {
      context.search.classList.toggle('active');
    });
  }
}
