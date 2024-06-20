import { getElement } from '../composables/useCallDom';

export class Dropdown {
  private dropdownBtn: HTMLElement;
  private dropdownList: HTMLElement;
  private dropdownBtnInfo: HTMLElement;
  private radioButtons: NodeListOf<HTMLInputElement>;

  constructor(dropdownSelector: string) {
    this.dropdownBtn = getElement(`${dropdownSelector} .dropdown__btn`) as HTMLElement;
    this.dropdownList = getElement(`${dropdownSelector} .dropdown__list`) as HTMLElement;
    this.dropdownBtnInfo = this.dropdownBtn.querySelector('.dropdown__btn_info') as HTMLElement;
    this.radioButtons = this.dropdownList.querySelectorAll('input[type="radio"]');

    this.init();
  }

  private init() {
    this.dropdownBtn.addEventListener('click', () => this.toggleDropdown());
    this.radioButtons.forEach((radio) => radio.addEventListener('change', () => this.updateDropdown(radio)));
    window.addEventListener('resize', () => this.checkScreenWidth());
    this.checkScreenWidth();
  }

  private toggleDropdown() {
    this.dropdownList.classList.toggle('active');
    this.dropdownBtn.classList.toggle('active');
  }

  private updateDropdown(radio: HTMLInputElement) {
    const label = radio.parentElement;
    console.log('Radio changed:', radio);
    console.log('Parent label:', label);

    if (label) {
      const labelText = label.textContent?.trim().replace(/[\s]+$/, '') ?? 'Size';
      console.log('Label text content:', labelText);
      this.dropdownBtnInfo.textContent = labelText;
    } else {
      this.dropdownBtnInfo.textContent = 'Size';
    }

    this.dropdownList.classList.remove('active');
    this.dropdownBtn.classList.remove('active');
  }

  private checkScreenWidth() {
    if (window.innerWidth > 1024) {
      this.dropdownList.classList.add('active');
      this.dropdownBtn.classList.add('active');
    } else {
      this.dropdownList.classList.remove('active');
      this.dropdownBtn.classList.remove('active');
    }
  }
}
