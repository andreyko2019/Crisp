import { ShopSome } from '../main/shop-some';
import { getElement, getElements } from '../composables/useCallDom';

import noUiSlider from 'nouislider';
const clothersWrapper = getElement('.shop-some__items');

export class FilterAccordeon extends ShopSome {
  accordeonButtons: NodeListOf<HTMLElement>;
  lengthLabels: NodeListOf<Element>;
  labels: NodeListOf<Element>;
  brand: string | null;
  length: string | null;
  colors: NodeListOf<Element>;
  rangeSlider: any;
  inputs: [Element | null, Element | null];
  inputFirst: Element | null;
  inputSecond: Element | null;

  constructor() {
    super();
    this.accordeonButtons = getElements('.accordeon__button') as NodeListOf<HTMLElement>;
    this.labels = getElements('.brand-item');
    this.lengthLabels = getElements('.length-item');
    this.colors = getElements('.color');
    let button: HTMLElement;
    let content: HTMLElement;
    let span: HTMLElement;
    this.brand = '';
    this.length = '';
    this.rangeSlider = document.getElementById('range-slider');

    this.inputFirst = getElement('.range__input_first');
    this.inputSecond = getElement('.range__input_second');
    this.inputs = [this.inputFirst, this.inputSecond];

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

    this.lengthLabels.forEach((label) => {
      label.addEventListener('click', () => {
        this.length = label.textContent;
        // console.log(this.brand)
        this.filterCardsByLength();
      });
    });

    this.colors.forEach((color) => {
      color.addEventListener('click', () => {
        console.log(color.getAttribute('data-color'));
        console.log(color);
      });
    });

    if (this.rangeSlider) {
      this.initializeSlider();
      this.changeInputs();
      
    }
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
    const allCards = [...this.shopDb];
    if (!this.brand) {
      return;
    }

    const filteredCardsByBrand = allCards.filter((card) => {
      return card.data.brand.stringValue.toLocaleLowerCase() === this.brand!.trim();
    });

    if (clothersWrapper) {
      clothersWrapper.innerHTML = '';

      filteredCardsByBrand.forEach((item) => {
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

  filterCardsByLength() {
    const allCards = [...this.shopDb];

    const filteredCards = allCards.filter((card) => {
      console.log(this.length?.trim(), card.data.length.stringValue);
      return card.data.length.stringValue === this.length!.trim();
    });

    if (clothersWrapper) {
      clothersWrapper.innerHTML = '';

      filteredCards.forEach((item) => {
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

  initializeSlider() {
    noUiSlider.create(this.rangeSlider, {
      start: [50, 1000],
      step: 1,
      connect: true,
      range: {
        min: 50,
        max: 1000,
      },
    });

    this.rangeSlider.noUiSlider.on('update', (values: any, handle: any) => {
      this.inputs[handle].value = Math.round(values[handle]);
    });
  }

  setRangeSlider(inputIndex: number, value: number) {
    const array = [null, null];
    array[inputIndex] = value;
    this.rangeSlider.noUiSlider.set(array);
    console.log(array);
  }

  changeInputs() {
    this.inputs.forEach((input, index) => {
      input?.addEventListener('change', (event) => {
        this.setRangeSlider(index, parseFloat(event.currentTarget.value));
      });
    });
  }
}

//  filterCardsByLength() {
//     const allCards = [...this.shopDb];

//     const filteredCards = allCards.filter((card) => {
//       // if (!card.data.length.stringValue) {
//       //   return;
//       // }
//       console.log(this.length?.trim(), card.data.length.stringValue);
//       return card.data.length.stringValue === this.length!.trim();
//     });

//     if (clothersWrapper) {
//       clothersWrapper.innerHTML = '';

//       filteredCards.forEach((item) => {
//         if (clothersWrapper) {
//           if (item.data.sale.booleanValue === false) {
//             clothersWrapper.insertAdjacentHTML(
//               'afterbegin',
//               `
//             <a class="card shop-some__card ${item.id}" href="one-product.html?id=${item.id}">
//               <div class="card__img">
//                 <picture>
//                   <source srcset=${item.data.imgWebP.stringValue} type="image/webp" />
//                   <img src=${item.data.img.stringValue} />
//                 </picture>
//               </div>
//               <div class="card__info">
//                 <p class="card__category">${item.data.category.stringValue}</p>
//                 <h3 class="card__title">${item.data.name.stringValue}</h3>
//                 <p class="card__price">${item.data.cost.stringValue}</p>
//               </div>
//             </a>
//             `
//             );
//           } else {
//             clothersWrapper.insertAdjacentHTML(
//               'afterbegin',
//               `
//             <a class="card sale shop-some__card ${item.id}" href="one-product.html?id=${item.id}">
//               <div class="card__img">
//                 <picture>
//                   <source srcset=${item.data.imgWebP.stringValue} type="image/webp" />
//                   <img src=${item.data.img.stringValue} />
//                 </picture>
//                 <div class="card__sale">
//                   <p>-30%</p>
//                 </div>
//               </div>
//               <div class="card__info">
//                 <p class="card__category">${item.data.category.stringValue}</p>
//                 <h3 class="card__title">${item.data.name.stringValue}</h3>
//                 <p class="card__price">${item.data.costNew.stringValue} <span>${item.data.cost.stringValue}</span></p>
//               </div>
//             </a>
//                 `
//             );
//           }
//         }
//       });
//     }
//   }

// filterCardsByLength() {
//     if (!this.length) {
//       return;
//     }

//     const filteredByLength = this.filteredCards.filter((card) => {
//       console.log(this.length?.trim(), card.data.length.stringValue);
//       return card.data.length.stringValue === this.length!.trim();
//     });

//     console.log(filteredByLength);
//     console.log(this.filteredCards)

//     if (clothersWrapper) {
//       clothersWrapper.innerHTML = '';

//       filteredByLength.forEach((item) => {
//         if (clothersWrapper) {
//           if (item.data.sale.booleanValue === false) {
//             clothersWrapper.insertAdjacentHTML(
//               'afterbegin',
//               `
//               <a class="card shop-some__card ${item.id}" href="one-product.html?id=${item.id}">
//                 <div class="card__img">
//                   <picture>
//                     <source srcset=${item.data.imgWebP.stringValue} type="image/webp" />
//                     <img src=${item.data.img.stringValue} />
//                   </picture>
//                 </div>
//                 <div class="card__info">
//                   <p class="card__category">${item.data.category.stringValue}</p>
//                   <h3 class="card__title">${item.data.name.stringValue}</h3>
//                   <p class="card__price">${item.data.cost.stringValue}</p>
//                 </div>
//               </a>
//               `
//             );
//           } else {
//             clothersWrapper.insertAdjacentHTML(
//               'afterbegin',
//               `
//               <a class="card sale shop-some__card ${item.id}" href="one-product.html?id=${item.id}">
//                 <div class="card__img">
//                   <picture>
//                     <source srcset=${item.data.imgWebP.stringValue} type="image/webp" />
//                     <img src=${item.data.img.stringValue} />
//                   </picture>
//                   <div class="card__sale">
//                     <p>-30%</p>
//                   </div>
//                 </div>
//                 <div class="card__info">
//                   <p class="card__category">${item.data.category.stringValue}</p>
//                   <h3 class="card__title">${item.data.name.stringValue}</h3>
//                   <p class="card__price">${item.data.costNew.stringValue} <span>${item.data.cost.stringValue}</span></p>
//                 </div>
//               </a>
//                   `
//             );
//           }
//         }
//       });
//     }
//   }
