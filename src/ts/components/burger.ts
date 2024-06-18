import { getElement } from '../composables/useCallDom';

export class Burger {
  burgerBtn: HTMLElement;
  menuAdapt: HTMLElement;

  constructor() {
    this.burgerBtn = getElement('.burger-btn') as HTMLElement;
    this.menuAdapt = getElement('.header__menu_adapt') as HTMLElement;

    this.burger();
  }

  burger(): void {
    const context = this;

    this.burgerBtn.addEventListener('click', function () {
      context.burgerBtn.classList.toggle('active');
      context.menuAdapt.classList.toggle('active');
    });
  }
}
