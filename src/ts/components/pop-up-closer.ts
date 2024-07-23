import { getElement } from '../composables/useCallDom';

export class PopupCloser {
  private popup: HTMLElement | null;
  private popupWrapper: HTMLElement;

  constructor(popupWrapper: string, popup: string) {
    this.popupWrapper = getElement(popupWrapper) as HTMLElement;
    this.popup = getElement(popup, this.popupWrapper);

    this.init();
  }

  private init() {
    document.addEventListener('click', this.handleClickOutside);
  }

  private handleClickOutside = (event: MouseEvent) => {
    if (this.popup && !this.popupWrapper.contains(event.target as Node) && this.popup.classList.contains('active')) {
      this.popup.classList.remove('active');
    }
  };
}
