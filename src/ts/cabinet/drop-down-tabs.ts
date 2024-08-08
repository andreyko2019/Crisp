import { Dropdown } from '../components/dropdown';

export class DropdownTabs extends Dropdown {
  constructor(dropdownSelectSelector: string, dropdownMenuSelector: string) {
    super(dropdownSelectSelector, dropdownMenuSelector);
    this.initDropdownTabs();
  }

  private initDropdownTabs() {
    if (window.innerWidth <= 768) {
      this.setupDropdown();
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        this.setupDropdown();
      } else {
        this.dropdownMenu.classList.remove('drop-down__menu');
        this.dropdownMenu.classList.remove('hidden');
      }
    });
  }

  private setupDropdown() {
    this.dropdownMenu.classList.add('drop-down__menu');
    this.dropdownMenu.classList.add('hidden');
    const activeItem = this.dropdownMenu.querySelector('.tabs__nav-btn_active') as HTMLElement;
    if (activeItem && activeItem.textContent) {
      this.dropdownSelect.textContent = activeItem.textContent.trim();
    }
  }

  override teardownDropdown() {
    this.dropdownMenu.classList.add('hidden');
    document.querySelector('.drop-down__select')?.classList.remove('active');
  }

  override onItemClick(item: HTMLElement) {
    this.menuItems.forEach((i) => i.classList.remove('tabs__nav-btn_active'));
    item.classList.add('tabs__nav-btn_active');
    super.onItemClick(item);

  }
}
