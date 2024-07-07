import { getElement } from '../composables/useCallDom';

export class ContactUs {
  private button: HTMLButtonElement;
  private container: HTMLElement | null;

  constructor(buttonSelector: string, containerSelector: string) {
    this.button = getElement(buttonSelector) as HTMLButtonElement;
    this.container = getElement(containerSelector);

    this.button.addEventListener('click', this.toggleContent.bind(this));
  }

  private toggleContent() {
    this.container?.classList.toggle('show-content');
  }
}
