import { getElements } from '../composables/callDom';

export class Accordion {
  accordionTitle: NodeListOf<HTMLElement>;
  accordionContent: NodeListOf<HTMLElement>;

  constructor() {
    this.accordionTitle = getElements('.accordion__item') as NodeListOf<HTMLElement>;
    this.accordionContent = getElements('.accordion__info') as NodeListOf<HTMLElement>;
    this.initAccordion();
  }

  initAccordion() {
    this.accordionTitle.forEach((title, index) => {
      title.addEventListener('click', () => {
        this.toggleAccordion(index);
      });
    });
  }

  toggleAccordion(index: number) {
    this.accordionContent[index].classList.toggle('active');
    this.accordionTitle[index].classList.toggle('active');
    const isOpen = this.accordionContent[index].classList.contains('active');

    if (isOpen) {
      this.closeOtherAccordions(index);
    }
  }

  closeOtherAccordions(currentIndex: number) {
    this.accordionContent.forEach((content, index) => {
      if (index !== currentIndex && content.classList.contains('active')) {
        content.classList.remove('active');
      }
    });
    this.accordionTitle.forEach((content, index) => {
      if (index !== currentIndex && content.classList.contains('active')) {
        content.classList.remove('active');
      }
    });
  }
}
