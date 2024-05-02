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
    const isOpen = this.accordionContent[index].classList.toggle('active');
    this.accordionTitle[index].classList.toggle('active');

    if (isOpen) {
      this.closeOtherAccordions(index);
    }

    this.accordionContent.forEach((content, i) => {
      if (i !== index) {
        content.style.maxHeight = '0'; // Закрываем другие аккордеоны
        content.classList.remove('active');
      }
    });

    if (isOpen) {
      this.accordionContent[index].style.maxHeight = `${this.accordionContent[index].scrollHeight}px`;
    } else {
      this.accordionContent[index].style.maxHeight = '0';
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
