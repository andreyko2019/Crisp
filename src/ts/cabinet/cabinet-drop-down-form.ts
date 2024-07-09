import { getElement } from '../composables/useCallDom';
import { Dropdown } from '../components/dropdown';

const stateDropdown = getElement('.drop-down#state');

export class DropdownForm extends Dropdown {
  constructor(dropdownSelectSelector: string, dropdownMenuSelector: string) {
    super(dropdownSelectSelector, dropdownMenuSelector);
  }

  override onItemClick(item: HTMLElement) {
    super.onItemClick(item);
    const selectedValue = item.textContent;
    if (selectedValue) {
      this.updateStateDropdown(selectedValue);
    }
  }

  private updateStateDropdown(selectedCountry: string) {
    const states = this.getStatesByCountry(selectedCountry);
    if (!stateDropdown) {
      console.error('State dropdown element not found');
      return;
    }

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
}
