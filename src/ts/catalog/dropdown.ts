export const dropdownWork = function () {
  class Dropdown {
    dropdownBox: HTMLElement | null;
    arrowSvg: HTMLElement | null;
    menu: HTMLElement | null;
    options: NodeListOf<HTMLElement>;
    selectedText: HTMLElement | null;

    constructor(dropdown: HTMLElement) {
      this.dropdownBox = dropdown.querySelector('.dropdown__box');
      this.arrowSvg = dropdown.querySelector('.dropdown__svg-arrow');
      this.menu = dropdown.querySelector('.dropdown__menu');
      this.options = dropdown.querySelectorAll('.dropdown__menu-item');
      this.selectedText = dropdown.querySelector('.dropdown__text');

      this.dropdownBox?.addEventListener('click', () => {
        this.arrowSvg?.classList.toggle('dropdown__svg-arrow_rotate');
        this.menu?.classList.toggle('dropdown__menu_open');
      });

      this.options.forEach((option) => {
        option.addEventListener('click', () => {
          if (this.selectedText instanceof HTMLElement && option instanceof HTMLElement) {
            this.selectedText.innerText = option.innerText;
            this.menu?.classList.remove('dropdown__menu_open');
          }

          this.arrowSvg?.classList.remove('dropdown__svg-arrow_rotate');
          this.options.forEach((opt) => {
            opt.classList.remove('dropdown__menu-item_active');
          });
          option.classList.add('dropdown__menu-item_active');
        });
      });
    }
  }

  const dropdowns = document.querySelectorAll<HTMLElement>('.dropdown');
  dropdowns.forEach((dropdown) => new Dropdown(dropdown));
};
