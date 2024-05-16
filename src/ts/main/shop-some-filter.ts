import { getElement, getElements } from '../composables/callDom';

interface Shop {
  img: { stringValue: string };
  imgWebP: { stringValue: string };
  category: { stringValue: string };
  name: { stringValue: string };
  cost: { stringValue: string };
  costNew: { stringValue: string | undefined };
  sale: { booleanValue: boolean };
}

export class ShopFilter {
  constructor() {
    this.initEventListeners();
  }

  private sendFetchRequest(category: string): void {
    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    // Формируем тело запроса
    const requestBody = JSON.stringify({
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
    });

    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents:runQuery`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка сети');
        }
        return response.json();
      })
      .then((data) => {
        // Проверяем наличие данных и массива документов
        if (data && Array.isArray(data) && data.length > 0) {
          // Фильтруем элементы массива data, чтобы получить только те, у которых есть поле document и в нем есть поле fields
          const items = data.filter((item) => item.document && item.document.fields).map((item) => item.document.fields);
          console.log(items);

          // Обновляем содержимое
          this.updateContent(items);
        } else {
          console.error('Ошибка: Данные Firestore пришли в неправильном формате.');
        }
      })
      .catch((error) => {
        console.error('Произошла ошибка:', error);
      });
  }

  private updateContent(items: Shop[]): void {
    const shopItemsContainer = getElement('.shop-some__items');
    if (shopItemsContainer) {
      shopItemsContainer.innerHTML = '';
      items.forEach((item) => {
        if (item.sale.booleanValue == false) {
          const cardHTML = `
          <a class="card shop-some__card" href="#">
            <div class="card__img">
              <picture>
                <source srcset=${item.imgWebP.stringValue} type="image/webp" />
                <img src=${item.img.stringValue}/>
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
                <img src=${item.img.stringValue}/>
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
