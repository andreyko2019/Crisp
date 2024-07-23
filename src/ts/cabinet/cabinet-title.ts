import { getElement, getElements } from '../composables/useCallDom';

export class CabinetTitle {
  private title: HTMLElement | null;
  private breadCrumbs: HTMLElement | null;
  private observer: MutationObserver;

  constructor() {
    this.title = getElement('.title__content h2');
    this.breadCrumbs = getElements('.bread-crumbs a')[1];
    this.updateTitle();

    this.observer = new MutationObserver(() => this.updateTitle());
    const config = { attributes: true, attributeFilter: ['class'], subtree: true };

    const tabsBtn = document.querySelectorAll('.tabs__nav-btn');
    tabsBtn.forEach((btn) => {
      this.observer.observe(btn, config);
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        this.setActiveTab(btn);
        this.updateUrl(btn);
      });
    });

    this.initActiveTab();
  }

  updateTitle() {
    if (this.title && this.breadCrumbs) {
      this.title.textContent = this.getActiveTabTitle();
      this.breadCrumbs.textContent = this.getActiveTabTitle();
    }
  }

  private getActiveTabTitle(): string {
    const activeTab = getElement('.tabs__nav-btn_active');
    return activeTab ? activeTab.textContent || '' : '';
  }

  private setActiveTab(btn: Element) {
    const tabsBtn = document.querySelectorAll('.tabs__nav-btn');
    tabsBtn.forEach((btn) => btn.classList.remove('tabs__nav-btn_active'));
    btn.classList.add('tabs__nav-btn_active');

    const tabId = btn.getAttribute('data-tab');
    const currentTab = getElement(tabId!) as HTMLElement;

    const tabsItems = document.querySelectorAll('.tabs__item');
    tabsItems.forEach((item) => item.classList.remove('tabs__item_active'));

    if (currentTab) {
      currentTab.classList.add('tabs__item_active');
    }

    this.updateTitle();
  }

  private updateUrl(btn: Element) {
    const tabId = btn.getAttribute('data-tab')?.substring(1);
    if (tabId) {
      history.pushState(null, '', `#${tabId}`);
    }
  }

  private initActiveTab() {
    const hash = window.location.hash;
    if (hash) {
      const tabBtn = document.querySelector(`.tabs__nav-btn[data-tab="${hash}"]`);
      if (tabBtn) {
        this.setActiveTab(tabBtn);
      }
    } else {
      const firstTabBtn = document.querySelector('.tabs__nav-btn');
      if (firstTabBtn) {
        this.setActiveTab(firstTabBtn);
      }
    }
  }
}
