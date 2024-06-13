import { getElements, getElement } from '../composables/callDom';

// export const dropdownWork = function () {
//   const dropdowns = document.querySelectorAll('.dropdown');

//   dropdowns.forEach((dropdown) => {
//     const dropdownBox = dropdown.querySelector('.dropdown__box');
//     const arrowSvg = dropdown.querySelector('.dropdown__svg-arrow');
//     const menu = dropdown.querySelector('.dropdown__menu');
//     const options = dropdown.querySelectorAll('.dropdown__menu-item');
//     const selectedText = dropdown.querySelector('.dropdown__text');

//     dropdownBox?.addEventListener('click', () => {
//       arrowSvg?.classList.toggle('dropdown__svg-arrow_rotate');
//       menu?.classList.toggle('dropdown__menu_open');
//     });

//     options.forEach((option) => {
//       option.addEventListener('click', () => {
//         if (selectedText instanceof HTMLElement && option instanceof HTMLElement) {
//           selectedText.innerText = option.innerText;
//           menu?.classList.remove('dropdown__menu_open');
//         }

//         arrowSvg?.classList.remove('dropdown__svg-arrow_rotate');
//         options.forEach((opt) => {
//           opt.classList.remove('dropdown__menu-item_active');
//         });
//         option.classList.add('dropdown__menu-item_active');
//       });
//     });
//   });
// };

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
