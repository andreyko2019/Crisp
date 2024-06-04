import { getElement, getElements } from '../composables/callDom';

export class LoadMoreComponent {
  containerSelector: string;
  cardSelector: string;
  buttonSelector: string;
  initialCardsToShow: number;
  additionalCardsToShow: number;

  constructor(containerSelector: string, cardSelector: string, buttonSelector: string, initialCardsToShow: number, additionalCardsToShow: number) {
    this.containerSelector = containerSelector;
    this.cardSelector = cardSelector;
    this.buttonSelector = buttonSelector;
    this.initialCardsToShow = initialCardsToShow;
    this.additionalCardsToShow = additionalCardsToShow;

    this.init();
  }

  init() {
    this.hidden();
    this.btnLoad();
  }

  hidden() {
    const cards = getElements(this.cardSelector);
    for (let i = 0; i < cards.length; i++) {
      if (i < this.initialCardsToShow) {
        continue;
      } else {
        cards[i].classList.add('hidden');
      }
    }
  }

  btnLoad() {
    const btn = getElement(this.buttonSelector);

    if (btn) {
      btn.addEventListener('click', () => {
        const hiddenCards = getElements(`${this.cardSelector}.hidden`);
        const remainingHiddenCards = getElements(`${this.cardSelector}.hidden`);

        for (let i = 0; i < hiddenCards.length && i < this.additionalCardsToShow; i++) {
          hiddenCards[i].classList.remove('hidden');
        }

        if (!remainingHiddenCards.length) {
          btn.classList.add('hidden');
        }
      });
    }
  }
}
