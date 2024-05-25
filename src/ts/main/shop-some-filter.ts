import { ShopFilters } from '../components/interface';
import { getElement, getElements } from '../composables/callDom';
import { fetchComposable } from '../composables/fetchComposable';

interface FirebaseResponse {
  document: {
    fields: ShopFilters;
  };
}

export class ShopFilter {
  constructor() {
    this.initEventListeners();
  }

  private async sendFetchRequest(category: string): Promise<void> {
    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const requestBody = {
      structuredQuery: {
        where: {
          fieldFilter: {
            field: {
              fieldPath: 'category',
            },
            op: 'EQUAL',
            value: {
              stringValue: category,
            },
          },
        },
        from: [
          {
            collectionId: 'clothers',
          },
        ],
      },
    };

    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents:runQuery`;

    const response = await fetchComposable<FirebaseResponse[], typeof requestBody>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    if (response.error) {
      console.error('Произошла ошибка:', response.error);
    } else if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const items = response.data.filter((item) => item.document && item.document.fields).map((item) => item.document.fields);
      console.log(items);
      this.updateContent(items);
    } else {
      console.error('Ошибка: Данные Firestore пришли в неправильном формате.');
    }
  }

  private updateContent(items: ShopFilters[]): void {
    const shopItemsContainer = getElement('.shop-some__items');
    if (shopItemsContainer) {
      shopItemsContainer.innerHTML = '';
      items.forEach((item) => {
        if (item.sale.booleanValue === false) {
          const cardHTML = `
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
        `;
          shopItemsContainer.innerHTML += cardHTML;
        } else {
          const cardHTML = `
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
        `;
          shopItemsContainer.innerHTML += cardHTML;
        }
      });

      const cards = getElements('.shop-some__card');
      for (let i = 0; i < cards.length; i++) {
        if (i < 8) {
          continue;
        } else {
          cards[i].classList.add('hidden');
        }
      }

      if (items.length > 8) {
        const loadMoreButton = document.createElement('button');
        loadMoreButton.classList.add('btn', 'shop-some__load');
        loadMoreButton.textContent = 'Load more';
        shopItemsContainer.insertAdjacentElement('beforeend', loadMoreButton);
      }

      const btn = getElement('.shop-some__load');
      if (btn) {
        btn.addEventListener('click', () => {
          const hiddenCards = getElements('.shop-some__card.hidden');
          for (let i = 0; i < hiddenCards.length && i < 8; i++) {
            hiddenCards[i].classList.remove('hidden');
          }
          const remainingHiddenCards = getElements('.shop-some__card.hidden');
          if (remainingHiddenCards.length === 0) {
            btn.classList.add('hidden');
          }
        });
      }
    }
  }

  private initEventListeners(): void {
    document.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      if (target && target.type === 'radio' && target.name === 'shop-filtr') {
        const category = target.parentNode?.textContent?.trim();
        if (category) {
          this.sendFetchRequest(category.toUpperCase());
        }
      }
    });
  }
}
