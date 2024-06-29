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
    });
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
}
