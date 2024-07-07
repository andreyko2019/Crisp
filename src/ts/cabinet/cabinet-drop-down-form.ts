import { getElement } from '../composables/useCallDom';

const stateDropdown = getElement('.drop-down#state');

export class DropdownForm {
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
    this.menuItems = this.dropdownMenu.querySelectorAll('.drop-down__item');

    this.init();
  }

  init() {
    this.dropdownSelect.addEventListener('click', (event) => this.toggleMenu(event));
    this.menuItems.forEach((item) => {
      item.addEventListener('click', () => this.onItemClick(item));
    });
    document.addEventListener('click', (event) => this.handleOutsideClick(event));

    // Ensure the dropdown menu is initially hidden
    this.dropdownMenu.classList.add('hidden');
  }

  private onItemClick(item: HTMLElement) {
    const selectedValue = item.textContent;
    if (selectedValue) {
      this.dropdownSelect.textContent = selectedValue;
      this.teardownDropdown();
      this.updateStateDropdown(selectedValue);
    }
  }

  private updateStateDropdown(selectedCountry: string) {
    const states = this.getStatesByCountry(selectedCountry);
    if (!stateDropdown) {
      console.error('State dropdown element not found');
      return;
    }

    // Clear the state dropdown select
    const stateSelect = stateDropdown.querySelector('.drop-down__select');
    if (stateSelect) {
      stateSelect.textContent = '';
    }

    const stateDropdownList = stateDropdown.querySelector('.drop-down__list');
    if (stateDropdownList) {
      stateDropdownList.innerHTML = '';
      states.forEach((state) => {
        const stateItem = document.createElement('div');
        stateItem.classList.add('drop-down__item');
        stateItem.textContent = state;
        stateDropdownList.appendChild(stateItem);
      });

      const stateItems = stateDropdownList.querySelectorAll('.drop-down__item');
      stateItems.forEach((item) => {
        item.addEventListener('click', () => {
          if (!stateDropdown) {
            console.error('State dropdown element not found');
            return;
          }
          const stateSelect = stateDropdown.querySelector('.drop-down__select');
          if (stateSelect) {
            stateSelect.textContent = item.textContent;
          }
          this.teardownDropdown();
        });
      });
    }
  }

  private getStatesByCountry(country: string): string[] {
    const statesByCountry: { [key: string]: string[] } = {
      Ukraine: ['Kyiv', 'Kharkiv', 'Odessa', 'Sumy', 'Zhytomyr', 'Lviv'],
      USA: ['California', 'New York', 'Texas'],
      Canada: ['Ontario', 'Quebec', 'British Columbia'],
    };

    return statesByCountry[country] || [];
  }

  private teardownDropdown() {
    this.dropdownMenu.classList.add('hidden');
    this.dropdownSelect.classList.remove('active');
  }

  private toggleMenu(event: Event) {
    event.stopPropagation();
    this.dropdownSelect.classList.toggle('active');
    this.dropdownMenu.classList.toggle('hidden');
  }

  private handleOutsideClick(event: MouseEvent) {
    if (!this.dropdownSelect.contains(event.target as Node) && !this.dropdownMenu.contains(event.target as Node)) {
      this.teardownDropdown();
    }
  }
}
