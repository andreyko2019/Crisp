import { ShopFilters } from '../components/interface';
import { getElement } from '../composables/callDom';
import { fetchComposable } from '../composables/useFetch';
import { LoadMoreComponent } from '../components/btnLoad';

export function loadCards() {
  const clothersWrapper = getElement('.shop-some__items');

  class ShopSome {
    shopDb: { id: string; data: ShopFilters }[];

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

  class Dropdown extends ShopSome {
    dropdownBox: HTMLElement | null;
    arrowSvg: HTMLElement | null;
    menu: HTMLElement | null;
    options: NodeListOf<HTMLElement>;
    selectedText: HTMLElement | null;
    sortOrder: 'ascend' | 'descend';

    constructor(dropdown: HTMLElement) {
      super();
      console.log(this.shopDb);
      // getElement('.dropdown__box', dropdown);
      this.dropdownBox = getElement('.dropdown__box', dropdown);
      this.arrowSvg = dropdown.querySelector('.dropdown__svg-arrow');
      this.menu = dropdown.querySelector('.dropdown__menu');
      this.options = dropdown.querySelectorAll('.dropdown__menu-item');
      this.selectedText = dropdown.querySelector('.dropdown__text');
      this.sortOrder = 'ascend';

      this.dropdownBox?.addEventListener('click', () => {
        this.arrowSvg?.classList.toggle('dropdown__svg-arrow_rotate');
        this.menu?.classList.toggle('dropdown__menu_open');
      });

      this.options.forEach((option) => {
        option.addEventListener('click', () => {
          if (this.selectedText instanceof HTMLElement && option instanceof HTMLElement) {
            this.selectedText.innerText = option.innerText;
            this.menu?.classList.remove('dropdown__menu_open');
            console.log(this.selectedText.innerText);
          }

          this.arrowSvg?.classList.remove('dropdown__svg-arrow_rotate');
          this.options.forEach((opt) => {
            opt.classList.remove('dropdown__menu-item_active');
          });
          option.classList.add('dropdown__menu-item_active');

          if (option.innerText === 'price (low to high)') {
            this.sortOrder = 'ascend';
          } else {
            this.sortOrder = 'descend';
          }
          this.renderCard();
        });
      });
    }

    renderCard() {
      let limitCards = Number(this.selectedText?.innerText);
      const visibleCards = this.shopDb.slice(0, limitCards);
      console.log(limitCards);

      // if (this.sortOrder === 'ascend') {
      //   visibleCards.sort((a, b) => a.data.cost - b.data.cost);
      // } else {
      //   visibleCards.sort((a, b) => b.data.cost - a.data.cost);
      // }

      // const str = '139,00 EUR';
      // const numb = parseFloat(str.replace(',', '.'));

      // console.log(numb);

      if (clothersWrapper) {
        // const loadElement = clothersWrapper.querySelector('.shop-some__load');
        clothersWrapper.innerHTML = '';

        visibleCards.forEach((item) => {
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
  }

  const dropdowns = document.querySelectorAll<HTMLElement>('.dropdown');
  dropdowns.forEach((dropdown) => new Dropdown(dropdown));
}
