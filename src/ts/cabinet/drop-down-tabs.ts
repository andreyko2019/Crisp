import { getElement } from '../composables/useCallDom';

export class DropdownTabs {
  private dropdownSelect: HTMLElement;
  private dropdownMenu: HTMLElement;
  private menuItems: NodeListOf<HTMLElement>;

  constructor(dropdownSelectSelector: string, dropdownMenuSelector: string) {
    const dropdownSelect = getElement(dropdownSelectSelector);
    const dropdownMenu = getElement(dropdownMenuSelector);

    if (!dropdownSelect || !dropdownMenu) {
      throw new Error('Dropdown select or menu element not found');
    }

    this.dropdownSelect = dropdownSelect;
    this.dropdownMenu = dropdownMenu;
    this.menuItems = this.dropdownMenu.querySelectorAll('.tabs__nav-btn');

    this.init();
  }

  private init() {
    if (window.innerWidth <= 768) {
      this.setupDropdown();
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        this.setupDropdown();
      } else {
        this.teardownDropdown();
      }
    });

    this.dropdownSelect.addEventListener('click', () => {
      this.toggleMenu();
    });

    this.menuItems.forEach((item) => {
      item.addEventListener('click', () => {
        this.selectItem(item);
      });
    });
  }

  private setupDropdown() {
    this.dropdownMenu.classList.add('drop-down__menu');
    this.dropdownMenu.classList.add('hidden');
    const activeItem = this.dropdownMenu.querySelector('.tabs__nav-btn_active');
    if (activeItem && activeItem.textContent) {
      this.dropdownSelect.textContent = activeItem.textContent.trim();
    }
  }

  private teardownDropdown() {
    this.dropdownMenu.classList.remove('drop-down__menu');
    this.dropdownMenu.classList.remove('hidden');
  }

  private toggleMenu() {
    this.dropdownSelect.classList.toggle('active');
    this.dropdownMenu.classList.toggle('hidden');
  }

  private selectItem(item: HTMLElement) {
    this.menuItems.forEach((i) => i.classList.remove('tabs__nav-btn_active'));
    item.classList.add('tabs__nav-btn_active');
    if (item.textContent) {
      this.dropdownSelect.textContent = item.textContent.trim();
    }
    this.toggleMenu();
  }
}
