import { ShopSome } from '../main/shop-some';
import { ShopFilters } from '../components/interface';
import { getElements, getElement } from '../composables/useCallDom';

// export class FilterAccordeon extends ShopSome{
//   accordeonButtons: NodeListOf<HTMLElement>;

//   constructor() {
//     super();
//     this.accordeonButtons = getElements('.accordeon__button') as NodeListOf<HTMLElement>;

//     this.accordeonButtons.forEach((button) => {
//       button.addEventListener('click', this.toggleClass.bind(this));
//     });
//   }

//   toggleClass(event: Event) {
//     const button = event.target as HTMLElement;
//     const content = button.nextElementSibling as HTMLElement;
//     const span = button.children[1].children[1] as HTMLElement;
//     console.log(span);
//     if (!content.classList.contains('accordeon__list_active')) {
//       content.classList.add('accordeon__list_active');
//       content.style.maxHeight = content.scrollHeight + 'px';
//       span.style.opacity = '0';
//     } else {
//       content.classList.remove('accordeon__list_active');
//       content.style.maxHeight = '0';
//       span.style.opacity = '1';
//     }
//   }

// }

const clothersWrapper = getElement('.shop-some__items');

export class FilterAccordeon extends ShopSome {
  accordeonButtons: NodeListOf<HTMLElement>;
  labels: NodeListOf<Element>;
  brand: string | null;
  constructor() {
    super();
    this.accordeonButtons = getElements('.accordeon__button') as NodeListOf<HTMLElement>;
    this.labels = getElements('.accordeon__item');
    let button: HTMLElement;
    let content: HTMLElement;
    let span: HTMLElement;
    this.brand = '';
    this.labels.forEach((label) => {
      label.addEventListener('click', () => {
        this.brand = label.textContent;
        // console.log(this.brand)
        this.filterCards();
      });
    });

    this.accordeonButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        button = btn;
        content = button.nextElementSibling as HTMLElement;
        span = button.children[1].children[1] as HTMLElement;

        this.toggleFunc(content, span);
      });
    });
  }

  toggleFunc(content: HTMLElement, span: HTMLElement) {
    if (!content.classList.contains('accordeon__list_active')) {
      content.classList.add('accordeon__list_active');
      content.style.maxHeight = content.scrollHeight + 'px';
      span.style.opacity = '0';
    } else {
      content.classList.remove('accordeon__list_active');
      content.style.maxHeight = '0';
      span.style.opacity = '1';
    }
  }

  filterCards() {
    const allCards = this.shopDb;
    console.log(this.brand);

    if (!this.brand) {
      return;
    }

    console.log(allCards)

    allCards.filter((card) => {
      console.log(this.brand?.trim())
      
      console.log(card.data.brand.stringValue, this.brand!.trim());
      return card.data.name.stringValue===this.brand!.trim();
    });

    console.log(allCards)
    

    allCards.forEach((item) => {
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

// this.accordeonButtons.forEach((button) => {
//   button.addEventListener('click', (event) => {
//     const label = event.target as HTMLElement;
//     const labelName = label.textContent?.trim(); // Получите текст метки
//     if (labelName) {
//       this.handleLabelSelection(labelName);
//     }
//   });
// });

//  class BrandFilter extends FilterAccordeon {
//   allCards: { id: string; data: ShopFilters }[];
//   selectedBrand: string | null;

//   constructor() {
//     super();
//     this.allCards = this.shopDb;
//     this.selectedBrand = null;
//   }

//   handleBrandSelection(brand: string) {
//     this.selectedBrand = brand;
//     this.showFilteredCards();
//   }

//    showFilteredCards() {
//      const radioButtons = document.querySelectorAll('.accordeon__item');
//      radioButtons.forEach((radio) => {
//        this.selectedBrand = radio.textContent;
//      })

//     if (!this.selectedBrand) {
//       console.log('NO!!!!')
//       return;
//     }

//     const filteredCards = this.allCards.filter((card) => {
//       return card.data.name.stringValue.includes(this.selectedBrand!);
//     });

//     filteredCards.forEach((item) => {
//       if (clothersWrapper) {
//         if (item.data.sale.booleanValue === false) {
//           clothersWrapper.insertAdjacentHTML(
//             'afterbegin',
//             `
//           <a class="card shop-some__card ${item.id}" href="one-product.html?id=${item.id}">
//             <div class="card__img">
//               <picture>
//                 <source srcset=${item.data.imgWebP.stringValue} type="image/webp" />
//                 <img src=${item.data.img.stringValue} />
//               </picture>
//             </div>
//             <div class="card__info">
//               <p class="card__category">${item.data.category.stringValue}</p>
//               <h3 class="card__title">${item.data.name.stringValue}</h3>
//               <p class="card__price">${item.data.cost.stringValue}</p>
//             </div>
//           </a>
//           `
//           );
//         } else {
//           clothersWrapper.insertAdjacentHTML(
//             'afterbegin',
//             `
//           <a class="card sale shop-some__card ${item.id}" href="one-product.html?id=${item.id}">
//             <div class="card__img">
//               <picture>
//                 <source srcset=${item.data.imgWebP.stringValue} type="image/webp" />
//                 <img src=${item.data.img.stringValue} />
//               </picture>
//               <div class="card__sale">
//                 <p>-30%</p>
//               </div>
//             </div>
//             <div class="card__info">
//               <p class="card__category">${item.data.category.stringValue}</p>
//               <h3 class="card__title">${item.data.name.stringValue}</h3>
//               <p class="card__price">${item.data.costNew.stringValue} <span>${item.data.cost.stringValue}</span></p>
//             </div>
//           </a>
//               `
//           );
//         }
//       }
//     });
//   }
// }

// const brandFilter = new BrandFilter();
// const radioButtons = document.querySelectorAll('.accordeon__item');
// console.log(radioButtons)
// radioButtons.forEach((radio) => {

//   radio.addEventListener('click', () => {
//     brandFilter.handleBrandSelection((radio as HTMLInputElement).value);

//   });
// });
