import { getElement } from '../composables/callDom';
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
    console.log(clothersWrapper);
    this.renderCard();
  }

  renderCard() {
    this.shopDb.forEach((item) => {
      if (clothersWrapper) {
        if (item.sale == false) {
          clothersWrapper.insertAdjacentHTML(
            'afterbegin',
            `
                <a class="card" href="#">
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
                    <a class="card sale" href="#">
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
}
