import { ShopFilters } from '../components/interface';
import { getElement } from '../composables/useCallDom';
import { ShopSome } from '../main/shop-some';
const shopBlock = getElement('.catalog__shop');
const nothing = getElement('.nothing');

export function loadCards() {
  const clothersWrapper = getElement('.shop-some__items');
  const allCardsArr: { id: string; data: ShopFilters }[] = [];
  let limitCardsAll = 0;

  class Dropdown extends ShopSome {
    dropdownBox: HTMLElement | null;
    arrowSvg: HTMLElement | null;
    menu: HTMLElement | null;
    options: NodeListOf<HTMLElement>;
    sortOptions: NodeListOf<HTMLElement>;
    selectedText: HTMLElement | null;
    selectedOrder: HTMLElement | null;
    sortOrder: 'ascend' | 'descend' | 'default';
    sortItems: NodeListOf<HTMLElement>;

    renderedCards: { id: string; data: ShopFilters }[];

    constructor(dropdown: HTMLElement) {
      super();
      this.dropdownBox = dropdown.querySelector('.dropdown__box');
      this.arrowSvg = dropdown.querySelector('.dropdown__svg-arrow');
      this.menu = dropdown.querySelector('.dropdown__menu');
      this.options = dropdown.querySelectorAll('.dropdown__menu-item');
      this.sortOptions = dropdown.querySelectorAll('.sort-item');
      this.selectedText = dropdown.querySelector('.limit');
      this.selectedOrder = dropdown.querySelector('.dropdown__text');
      this.sortItems = dropdown.querySelectorAll('.sort-item');
      this.sortOrder = 'ascend';

      this.renderedCards = [];

      this.dropdownBox?.addEventListener('click', () => {
        this.arrowSvg?.classList.toggle('dropdown__svg-arrow_rotate');
        this.menu?.classList.toggle('dropdown__menu_open');
      });

      this.options.forEach((option) => {
        option.addEventListener('click', () => {
          if (this.selectedText instanceof HTMLElement && option instanceof HTMLElement) {
            this.selectedText.innerText = option.innerText;
            this.menu?.classList.remove('dropdown__menu_open');
          }

          this.arrowSvg?.classList.remove('dropdown__svg-arrow_rotate');

          this.options.forEach((opt) => {
            opt.classList.remove('dropdown__menu-item_active');
          });
          option.classList.add('dropdown__menu-item_active');
          this.renderCard();
        });
      });

      this.sortItems.forEach((item) => {
        item.addEventListener('click', () => {
          console.log(item.innerText === 'HIGH', item.innerText);
          if (this.selectedOrder instanceof HTMLElement && item instanceof HTMLElement) {
            this.selectedOrder.innerText = item.innerText;
            this.menu?.classList.remove('dropdown__menu_open');
          }
          if (item.innerText === 'HIGH') {
            this.sortOrder = 'ascend';
          } else if (item.innerText === 'LOW') {
            this.sortOrder = 'descend';
          } else {
            this.sortOrder = 'default';
          }

          this.sortedCards();
        });
      });
    }

    renderCard = () => {
      allCardsArr.length = 0;

      if (this.selectedText) {
        limitCardsAll = Number(this.selectedText?.textContent);
        console.log(limitCardsAll);
        const visibleCards = this.shopDb.slice(0, limitCardsAll);
        if (clothersWrapper) {
          clothersWrapper.innerHTML = '';

          visibleCards.forEach((item) => {
            if (clothersWrapper) {
              if (item.data.sale.booleanValue === false) {
                clothersWrapper.insertAdjacentHTML(
                  'afterbegin',
                  `
            <a class="card shop-some__card ${item.id}" href="/one-product?id=${item.id}">
              <div class="card__img">
                <picture>
                  <source srcset=${item.data.imgWebP.stringValue} type="image/webp" />
                  <img src=${item.data.img.stringValue} alt="img">
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
                  <img src=${item.data.img.stringValue} alt="img">
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

          localStorage.setItem('Cards', JSON.stringify(this.renderedCards));
          console.log(shopBlock);
        }
        shopBlock?.classList.remove('catalog__shop_no-cards');
        nothing?.classList.remove('nothing_active');
      }
    };

    sortedCards = () => {
      console.log(limitCardsAll);
      const visibleCards = this.shopDb.slice(0, limitCardsAll);

      if (this.sortOrder === 'ascend') {
        visibleCards.sort((a, b) => {
          const costStr1 = Object.values(a.data.cost.stringValue);
          const costStr2 = Object.values(b.data.cost.stringValue);
          const costNum1 = costStr1.join('').trim().split(' ')[0].replace(',', '.');
          const costNum2 = costStr2.join('').trim().split(' ')[0].replace(',', '.');
          return Number(costNum1) - Number(costNum2);
        });
      } else if (this.sortOrder === 'descend') {
        visibleCards.sort((a, b) => {
          const costStr1 = Object.values(a.data.cost.stringValue);
          const costStr2 = Object.values(b.data.cost.stringValue);
          const costNum1 = costStr1.join('').trim().split(' ')[0].replace(',', '.');
          const costNum2 = costStr2.join('').trim().split(' ')[0].replace(',', '.');
          return Number(costNum2) - Number(costNum1);
        });
      } else {
        visibleCards.sort((a, b) => {
          const brand1 = a.data.brand.stringValue;
          const brand2 = b.data.brand.stringValue;
          return brand1.localeCompare(brand2);
        });
      }

      if (clothersWrapper) {
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
                  <img src=${item.data.img.stringValue} alt="img">
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
                  <img src=${item.data.img.stringValue} alt="img">
                </picture>
                <div class="card__sale">
                  <p>-30%</p>
                </div>
              </div>
              <div class="card__info">
                <p class="card__category">${item.data.category.stringValue}</p>
                <h3 class="card__title">${item.data.name.stringValue}</h3>
                <p class="card__price">$${item.data.cost.stringValue} <span>${item.data.costNew.stringValue}</span></p>
              </div>
            </a>
                `
              );
            }
          }
        });
      }
    };
  }

  const dropdowns = document.querySelectorAll<HTMLElement>('.dropdown');

  dropdowns.forEach((dropdown) => {
    return new Dropdown(dropdown);
  });
}
