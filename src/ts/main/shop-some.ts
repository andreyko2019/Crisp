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
    // this.setupFilters();
  }

  async loadCards() {
    querySnapshot(await getDoc('clothers'), (doc) => this.shopDb.push(doc.data() as Shop));
    console.log(this.shopDb);
    this.renderCard();
    this.loadMore(); // Call loadMore after rendering cards
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

  // setupFilters() {
  //   const checkboxes = getElements('input[name="shop-filtr"]');
  //   checkboxes.forEach((checkbox) => {
  //     checkbox.addEventListener('change', () => {
  //       const filters = this.getSelectedFilters();
  //       this.filterCards(filters); // Call filterCards with selected filters
  //     });
  //   });
  // }

  // getSelectedFilters() {
  //   const checkboxes = getElements('input[name="shop-filtr"]:checked');
  //   return Array.from(checkboxes).map((checkbox) => checkbox.id);
  // }

  // filterCards(filters: string[]) {
  //   const xhr = new XMLHttpRequest();
  //   xhr.onreadystatechange = () => {
  //     if (xhr.readyState === XMLHttpRequest.DONE) {
  //       if (xhr.status === 200) {
  //         const filteredData = JSON.parse(xhr.responseText);
  //         this.updateCardDisplay(filteredData);
  //       } else {
  //         console.error('Failed to fetch filtered data:', xhr.status);
  //       }
  //     }
  //   };

  //   // Construct URL with selected filters
  //   const url = `/filter?categories=${filters.join(',')}`;

  //   xhr.open('GET', url, true);
  //   xhr.send();
  // }

  // updateCardDisplay(filteredData: Shop[]) {
  //   const cards = getElements('.shop-some__card');
  //   cards.forEach((card, index) => {
  //     if (filteredData[index]) {
  //       card.classList.remove('hidden');
  //       // Update card content here if necessary
  //     } else {
  //       card.classList.add('hidden');
  //     }
  //   });
  // }
}
