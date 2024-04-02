import $ from 'jquery';

export class Burger {
  burgerBtn: JQuery<HTMLDivElement>;
  menuAdapt: JQuery<HTMLDivElement>;
  constructor() {
    this.burgerBtn = $('.burger-btn');
    this.menuAdapt = $('.header__menu_adapt');

    this.burger();
  }

  burger(): void {
    const context = this;
    this.burgerBtn.on('click', function () {
      context.burgerBtn.toggleClass('active');
      context.menuAdapt.toggleClass('active');
    });
  }
}
