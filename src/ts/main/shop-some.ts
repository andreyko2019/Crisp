import { ShopFilters } from '../components/interface';
import { getElement } from '../composables/callDom';
import { fetchComposable } from '../composables/fetchComposable';
import { LoadMoreComponent } from '../components/btnLoad';

const clothersWrapper = getElement('.shop-some__items');

export class ShopSome {
  shopDb: ShopFilters[];

  constructor() {
    this.shopDb = [];
    this.loadCards();
  }

  async loadCards() {
    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const requestBody: { structuredQuery: { from: { collectionId: string }[] } } = {
      structuredQuery: {
        from: [
          {
            collectionId: 'clothers',
          },
        ],
      },
    };

    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents:runQuery`;

    const response = await fetchComposable<{ document: { fields: ShopFilters } }[], typeof requestBody>(url, {
      method: 'POST',
      body: requestBody,
    });

    if (response.error) {
      console.error('Ошибка при загрузке данных:', response.error);
      return;
    }

    if (response.data) {
      response.data.forEach((doc) => {
        this.shopDb.push(doc.document.fields);
      });
      console.log(this.shopDb);
      this.renderCard();
      new LoadMoreComponent('.shop-some__items', '.shop-some__card', '.shop-some__load', 8, 8);
    }
  }

  renderCard() {
    this.shopDb.forEach((item) => {
      if (clothersWrapper) {
        if (item.sale.booleanValue === false) {
          clothersWrapper.insertAdjacentHTML(
            'afterbegin',
            `
            <a class="card shop-some__card" href="#">
              <div class="card__img">
                <picture>
                  <source srcset=${item.imgWebP.stringValue} type="image/webp" />
                  <img src=${item.img.stringValue} />
                </picture>
              </div>
              <div class="card__info">
                <p class="card__category">${item.category.stringValue}</p>
                <h3 class="card__title">${item.name.stringValue}</h3>
                <p class="card__price">${item.cost.stringValue}</p>
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
                <picture>
                  <source srcset=${item.imgWebP.stringValue} type="image/webp" />
                  <img src=${item.img.stringValue} />
                </picture>
                <div class="card__sale">
                  <p>-30%</p>
                </div>
              </div>
              <div class="card__info">
                <p class="card__category">${item.category.stringValue}</p>
                <h3 class="card__title">${item.name.stringValue}</h3>
                <p class="card__price">${item.costNew.stringValue} <span>${item.cost.stringValue}</span></p>
              </div>
            </a>
                `
          );
        }
      }
    });
  }
}
