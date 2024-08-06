import { ShopFilters } from '../components/interface';
import { getElement, getElements, renderElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';
import { Loader } from '../modules/stop-preload';

const clothersWrapper = getElement('.shop-some__items');

export class ShopFilter {
  shopDb: { id: string; data: ShopFilters }[];
  activeFilterId: string | null;

  constructor() {
    this.shopDb = [];
    this.activeFilterId = null;
    this.initEventListeners();
  }

  private async sendFetchRequest(category?: string): Promise<void> {
    document.getElementsByClassName('shop-some__items')[0].classList.add('skeleton');

    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const requestBody = category
      ? {
        structuredQuery: {
          where: {
            fieldFilter: {
              field: { fieldPath: 'category' },
              op: 'EQUAL',
              value: { stringValue: category },
            },
          },
          from: [{ collectionId: 'clothers' }],
        },
      }
      : {
        structuredQuery: {
          from: [{ collectionId: 'clothers' }],
        },
      };

    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents:runQuery`;

    const response = await fetchComposable<{ document: { name: string; fields: ShopFilters } }[], typeof requestBody>(url, {
      method: 'POST',
      body: requestBody,
    });

    if (response.error) {
      console.error('Произошла ошибка:', response.error);
    } else if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const items = response.data
        .filter((item) => item.document && item.document.fields)
        .map((item) => {
          const id = item.document.name.split('/').pop();
          return {
            id,
            data: item.document.fields,
          };
        })
        .filter((item): item is { id: string; data: ShopFilters } => !!item.id);

      this.updateContent(items);
    } else {
      console.error('Ошибка: Данные Firestore пришли в неправильном формате.');
    }
  }

  private updateContent(items: { id: string; data: ShopFilters }[]): void {
    if (clothersWrapper) {
      clothersWrapper.innerHTML = '';
      items.forEach((item) => {
        const card = renderElement('a', ['card', 'shop-some__card', item.id]) as HTMLAnchorElement;
        card.href = `one-product.html?id=${item.id}`;
        if (item.data.sale.booleanValue) {
          card.classList.add('sale');
        }

        const img = renderElement('div', 'card__img');
        img.innerHTML = `
          <picture>
            <source srcset="${item.data.imgWebP.stringValue}" type="image/webp" />
            <img src="${item.data.img.stringValue}" alt="${item.data.name.stringValue}" />
          </picture>
        `;
        if (item.data.sale.booleanValue) {
          img.innerHTML += `
            <div class="card__sale">
              <p>-30%</p>
            </div>
          `;
        }

        const info = renderElement('div', 'card__info');

        const category = renderElement('p', 'card__category');
        category.innerText = item.data.category.stringValue;

        const title = renderElement('h3', 'card__title');
        title.innerText = item.data.name.stringValue;

        const price = renderElement('p', 'card__price');
        if (!item.data.sale.booleanValue) {
          price.innerText = item.data.cost.stringValue;
        } else {
          price.innerHTML = `${item.data.costNew.stringValue} <span>${item.data.cost.stringValue}</span>`;
        }

        info.append(category, title, price);
        card.append(img, info);
        clothersWrapper.appendChild(card);
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
        loadMoreButton.textContent = 'See more';
        clothersWrapper.insertAdjacentElement('beforeend', loadMoreButton);
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
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLInputElement;

      if (target && target.type === 'radio' && target.name === 'shop-filtr') {
        const category = target.parentNode?.textContent?.trim();

        if (this.activeFilterId === target.id) {
          target.checked = false;
          this.activeFilterId = null;
          console.log('Сброс фильтра');
          this.sendFetchRequest().then(() => {
            Loader.stop('shop-some__items');
          });
        } else {
          target.checked = true;
          this.activeFilterId = target.id;
          console.log(`Активирован фильтр по категории: ${category}`);
          if (category) {
            this.sendFetchRequest(category.toUpperCase()).then(() => {
              Loader.stop('shop-some__items');
            });
          }
        }
      }
    });
  }
}
