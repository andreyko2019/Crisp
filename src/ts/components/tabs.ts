import { getElement, getElements } from '../composables/useCallDom';

export class Tabs {
  private tabsBtn: NodeListOf<HTMLElement>;
  private tabsItems: NodeListOf<HTMLElement>;

  constructor() {
    this.tabsBtn = getElements('.tabs__nav-btn') as NodeListOf<HTMLElement>;
    this.tabsItems = getElements('.tabs__item') as NodeListOf<HTMLElement>;

    this.init();
  }

  private init() {
    this.tabsBtn.forEach((item) => {
      item.addEventListener('click', () => this.onTabClick(item));
    });
  }

  private onTabClick(currentBtn: HTMLElement) {
    const tabId = currentBtn.getAttribute('data-tab');
    const currentTab = getElement(tabId!) as HTMLElement;

    if (!currentBtn.classList.contains('active')) {
      this.tabsBtn.forEach((item) => item.classList.remove('tabs__nav-btn_active'));
      this.tabsItems.forEach((item) => item.classList.remove('tabs__item_active'));

      currentBtn.classList.add('tabs__nav-btn_active');
      if (currentTab) {
        currentTab.classList.add('tabs__item_active');
      }
    }
  }
}
