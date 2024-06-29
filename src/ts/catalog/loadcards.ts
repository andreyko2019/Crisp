import { ShopFilters } from '../components/interface';
import { getElement } from '../composables/useCallDom';
import { ShopSome } from '../main/shop-some';

export function loadCards() {
  const clothersWrapper = getElement('.shop-some__items');
  const allCardsArr: { id: string; data: ShopFilters; }[] = [];
  let limitCardsAll = 0;
  class Dropdown extends ShopSome {
    dropdownBox: HTMLElement | null;
    arrowSvg: HTMLElement | null;
    menu: HTMLElement | null;
    options: NodeListOf<HTMLElement>;
    sortOptions: NodeListOf<HTMLElement>;
    selectedText: HTMLElement | null;
    selectedOrder: HTMLElement | null;
    sortOrder: 'ascend' | 'descend';
    sortItems: NodeListOf<HTMLElement>;
    // limitCardsAll: number;
    
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
      // this.limitCardsAll = 0;
      
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
          } else {
            this.sortOrder = 'descend';
          }
          console.log(this.sortOrder);
          this.sortedCards();
        });
      });
    }

    renderCard =() => {
      allCardsArr.length = 0;
      const currentArray: { id: string; data: ShopFilters }[] = [];
      if (this.selectedText) {
        // const limitCards = Number(this.selectedText?.textContent);
        limitCardsAll = Number(this.selectedText?.textContent);
        console.log(limitCardsAll)
        const visibleCards = this.shopDb.slice(0, limitCardsAll);
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
            currentArray.push(item);
            
            // allCardsArr.push(item)
            allCardsArr.push(...currentArray);
            
          });
          
          allCardsArr.push(...currentArray);
          console.log(allCardsArr);
          // this.renderedCards = currentArray;
          // console.log(this.renderedCards);
          localStorage.setItem('Cards', JSON.stringify(this.renderedCards));
        }
      }

      // allCardsArr.push(...currentArray);
      // console.log(allCardsArr);
    }

    // setTimeout(() => {
    //   this.sortedCards();
    // },0);
    
    sortedCards=()=> {
      // const limitCardsAll = [...allCardsArr];
      console.log(limitCardsAll)
      const visibleCards = this.shopDb.slice(0, limitCardsAll);
      // console.log(limitCardsAll);
      // console.log(allCardsArr)
      // console.log(this.sortOrder);

      // console.log(this.renderedCards)
      // const savedCards = JSON.parse(localStorage.getItem("Cards"));
      // console.log(savedCards)

      if (this.sortOrder === 'ascend') {
        visibleCards.sort((a, b) => {
          const costStr1 = Object.values(a.data.cost.stringValue);
          const costStr2 = Object.values(b.data.cost.stringValue);
          const costNum1 = costStr1.join('').trim().split(' ')[0].replace(',', '.');
          const costNum2 = costStr2.join('').trim().split(' ')[0].replace(',', '.');
          console.log(Number(costNum1), Number(costNum2));
          console.log(this.sortOrder)
          return Number(costNum1) - Number(costNum2);
          
        });
      } else {
        visibleCards.sort((a, b) => {
          const costStr1 = Object.values(a.data.cost.stringValue);
          const costStr2 = Object.values(b.data.cost.stringValue);
          const costNum1 = costStr1.join('').trim().split(' ')[0].replace(',', '.');
          const costNum2 = costStr2.join('').trim().split(' ')[0].replace(',', '.');
          console.log(this.sortOrder);
          console.log(Number(costNum1), Number(costNum2));
          return Number(costNum2) - Number(costNum1);
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

  dropdowns.forEach((dropdown) => {
    return new Dropdown(dropdown);
  });
}
