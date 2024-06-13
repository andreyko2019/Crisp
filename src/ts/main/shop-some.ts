import { ShopFilters } from '../components/interface';
import { getElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';
import { LoadMoreComponent } from '../components/btnLoad';
import { Loader } from '../modules/stop-preload';

const clothersWrapper = getElement('.shop-some__items');

export class ShopSome {
  shopDb: { id: string; data: ShopFilters }[];

  constructor() {
    this.shopDb = [];

    this.loadCards().then(() => Loader.stop('shop-some__items'));
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

    const response = await fetchComposable<{ document: { name: string; fields: ShopFilters } }[], typeof requestBody>(url, {
      method: 'POST',
      body: requestBody,
    });

    if (response.error) {
      console.error('Ошибка при загрузке данных:', response.error);
      return;
    }

    if (response.data) {
      response.data.forEach((doc) => {
        const docId = doc.document.name.split('/').pop() || '';
        this.shopDb.push({ id: docId, data: doc.document.fields });
      });
      console.log(this.shopDb);
      this.renderCard();
      new LoadMoreComponent('.shop-some__items', '.shop-some__card', '.shop-some__load', 8, 8);
    }
  }

  renderCard() {
    this.shopDb.forEach((item) => {
      if (clothersWrapper) {
        if (item.data.sale.booleanValue === false) {
          clothersWrapper.insertAdjacentHTML(
            'afterbegin',
            `
            <a class="card shop-some__card ${item.id}" href="one-product.html?id=${item.id}">
              <div class="card__img">
                <picture>
                  <source srcset=${item.data.imgWebP.stringValue} type="image/webp" />
                  <img src=${item.data.img.stringValue} />
                </picture>
              </div>
              <div class="card__info">
                <p class="card__category">${item.data.category.stringValue}</p>
                <h3 class="card__title">${item.data.name.stringValue}</h3>
                <p class="card__price">${item.data.cost.stringValue}</p>
              </div>
            </a>
            `
          );
        } else {
          clothersWrapper.insertAdjacentHTML(
            'afterbegin',
            `
            <a class="card sale shop-some__card ${item.id}" href="one-product.html?id=${item.id}">
              <div class="card__img">
                <picture>
                  <source srcset=${item.data.imgWebP.stringValue} type="image/webp" />
                  <img src=${item.data.img.stringValue} />
                </picture>
                <div class="card__sale">
                  <p>-30%</p>
                </div>
              </div>
              <div class="card__info">
                <p class="card__category">${item.data.category.stringValue}</p>
                <h3 class="card__title">${item.data.name.stringValue}</h3>
                <p class="card__price">${item.data.costNew.stringValue} <span>${item.data.cost.stringValue}</span></p>
              </div>
            </a>
                `
          );
        }
      }
    });
  }
}
