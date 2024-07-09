import { getElement, getElements } from '../composables/useCallDom';

export class Dropdown {
  dropdownSelect: HTMLElement;
  dropdownMenu: HTMLElement;
  menuItems: NodeListOf<HTMLElement>;

  constructor(dropdownSelectSelector: string, dropdownMenuSelector: string) {
    const dropdownSelect = getElement(dropdownSelectSelector);
    const dropdownMenu = getElement(dropdownMenuSelector);

    if (!dropdownSelect || !dropdownMenu) {
      throw new Error('Dropdown select or menu element not found');
    }

    this.dropdownSelect = dropdownSelect;
    this.dropdownMenu = dropdownMenu;
    this.menuItems = getElements('.drop-down__item', this.dropdownMenu);

    this.init();
  }

  init() {
    this.dropdownSelect.addEventListener('click', (event) => this.toggleMenu(event));
    this.menuItems.forEach((item) => {
      item.addEventListener('click', () => this.onItemClick(item));
    });
    document.addEventListener('click', (event) => this.handleOutsideClick(event));

    this.dropdownMenu.classList.add('hidden');
  }

  onItemClick(item: HTMLElement) {
    const selectedValue = item.textContent;
    if (selectedValue) {
      this.dropdownSelect.textContent = selectedValue;
      this.teardownDropdown();
    }
  }

  teardownDropdown() {
    this.dropdownMenu.classList.add('hidden');
    this.dropdownSelect.classList.remove('active');
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.dropdownSelect.classList.toggle('active');
    this.dropdownMenu.classList.toggle('hidden');
  }

  handleOutsideClick(event: MouseEvent) {
    if (!this.dropdownSelect.contains(event.target as Node) && !this.dropdownMenu.contains(event.target as Node)) {
      this.teardownDropdown();
    }
  }
}
