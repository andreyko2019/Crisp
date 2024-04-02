export class Burger {
  burgerBtn: HTMLElement;
  menuAdapt: HTMLElement;
  search: HTMLElement;
  searchBtn: HTMLElement;

  constructor() {
    this.burgerBtn = document.querySelector('.burger-btn') as HTMLElement;
    this.menuAdapt = document.querySelector('.header__menu_adapt') as HTMLElement;
    this.search = document.querySelector('.header__search-and-bag .search') as HTMLElement;
    this.searchBtn = document.querySelector('.header__search-and-bag .search svg') as HTMLElement;

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
