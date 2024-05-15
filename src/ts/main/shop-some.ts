import { getElement, getElements } from '../composables/callDom';
import { getDoc, querySnapshot } from '../composables/useData';

interface Shop {
  img: string;
  imgWebP: string;
  category: string;
  name: string;
  cost: string;
  costNew: string | undefined;
  sale: boolean;
}

const clothersWrapper = getElement('.shop-some__items');

export class ShopSome {
  shopDb: Shop[];

  constructor() {
    this.shopDb = [];

    this.loadCards();
  }

  async loadCards() {
    querySnapshot(await getDoc('clothers'), (doc) => this.shopDb.push(doc.data() as Shop));
    console.log(this.shopDb);
    this.renderCard();
    this.loadMore();
  }

  renderCard() {
    this.shopDb.forEach((item) => {
      if (clothersWrapper) {
        if (item.sale == false) {
          clothersWrapper.insertAdjacentHTML(
            'afterbegin',
            `
                <a class="card shop-some__card" href="#">
                    <div class="card__img">
                        <img src="${item.img}" alt="" />
                    </div>

                    <div class="card__info">
                        <p class="card__category">${item.category}</p>
                        <h3 class="card__title">${item.name}</h3>
                        <p class="card__price">${item.cost}</p>
                    </div>
                </a>
            `
          );
        } else {
          clothersWrapper.insertAdjacentHTML(
            'afterbegin',
            `
                    <a class="card sale shop-some__card" href="#">
                        <div class="card__img">
                            <img src="${item.img}" alt="" />
                            <div class="card__sale">
                                <p>-30%</p>
                            </div>
                        </div>
    
                        <div class="card__info">
                            <p class="card__category">${item.category}</p>
                            <h3 class="card__title">${item.name}</h3>
                            <p class="card__price">${item.costNew} <span>${item.cost}</span></p>
                        </div>
                    </a>
                `
          );
        }
      }
    });
  }

  loadMore() {
    this.hidden();
    this.btnLoad();
  }

  hidden() {
    const cards = getElements('.shop-some__card');
    for (let i = 0; i < cards.length; i++) {
      if (i < 8) {
        continue;
      } else {
        cards[i].classList.add('hidden');
      }
    }
  }

  btnLoad() {
    const btn = getElement('.shop-some__load');
    if (btn) {
      btn.addEventListener('click', () => {
        const hiddenCards = getElements('.shop-some__card.hidden');
        for (let i = 0; i < hiddenCards.length && i < 8; i++) {
          hiddenCards[i].classList.remove('hidden');
        }
        const remainingHiddenCards = getElements('.shop-some__card.hidden');
        if (remainingHiddenCards.length === 0) {
          btn.classList.add('hidden'); // Hide the button
        }
      });
    }
  }
}
