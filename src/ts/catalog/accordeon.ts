import { ShopSome } from '../main/shop-some';
import { getElement, getElements } from '../composables/useCallDom';
import noUiSlider from 'nouislider';

const clothersWrapper = getElement('.shop-some__items');
const shopBlock = getElement('.catalog__shop');
const nothing = getElement('.nothing');

export class FilterAccordeon extends ShopSome {
  accordeonButtons: NodeListOf<HTMLElement>;
  lengthLabels: NodeListOf<Element>;
  labels: NodeListOf<Element>;
  brand: string | null;
  brandChecked: HTMLElement | null;
  resetBrand: HTMLElement | null;
  length: string | null;
  lengthChecked: HTMLElement | null;
  minPrice: number | null;
  maxPrice: number | null;
  priceChecked: HTMLElement | null;
  resetPrice: HTMLElement | null;
  minPriceChecked: HTMLElement | null;
  maxPriceChecked: HTMLElement | null;
  rangeSlider: any;
  inputs: [HTMLInputElement | null, HTMLInputElement | null];
  inputFirst: HTMLInputElement | null;
  inputSecond: HTMLInputElement | null;
  filteredCards: any[];
  allCheckedFilters: HTMLElement | null;
  colors: NodeListOf<HTMLElement> | null;
  colorChecked: HTMLElement | null;
  brandBlock: HTMLElement | null;
  colorsBlock: HTMLElement | null;
  resetColor: HTMLElement | null;
  lengthBlock: HTMLElement | null;
  resetLength: HTMLElement | null;
  sizeBlock: HTMLElement | null;
  sizesList: NodeListOf<HTMLElement> | null;
  sizeValue: NodeListOf<HTMLElement> | null;
  sizeArray: Array<string> | null;
  size: string;
  sizeChecked: HTMLElement | null;
  priceBlock: HTMLElement | null;
  resetAllFilters: HTMLElement | null;
  resetSize: HTMLElement | null;
  filterSvg: HTMLElement | null;
  filterForms: HTMLElement | null;
  closeFilterForms: HTMLElement | null;

  constructor() {
    super();
    this.accordeonButtons = getElements('.accordeon__button') as NodeListOf<HTMLElement>;
    this.labels = getElements('.brand-item');
    this.lengthLabels = getElements('.length-item');
    this.minPrice = null;
    this.maxPrice = null;
    this.brand = null;
    this.brandChecked = getElement('.used-filters__value_brand');
    this.resetBrand = getElement('.reset-brand');
    this.length = null;
    this.lengthChecked = getElement('.used-filters__value_length');
    this.resetLength = getElement('.reset-length');

    this.rangeSlider = document.getElementById('range-slider');
    this.priceChecked = getElement('.used-filters__range-value');
    this.minPriceChecked = getElement('.used-filters__range-value-min');
    this.maxPriceChecked = getElement('.used-filters__range-value-max');
    this.resetPrice = getElement('.reset-price');

    this.inputFirst = getElement('.range__input_first') as HTMLInputElement;
    this.inputSecond = getElement('.range__input_second') as HTMLInputElement;
    this.inputs = [this.inputFirst, this.inputSecond];
    this.filteredCards = [...this.shopDb];
    this.filterSvg = getElement('.catalog__filter-svg');
    this.filterForms = getElement('.catalog__filter-forms');
    this.closeFilterForms = getElement('.catalog__filter-close-filters');
    this.colors = getElements('.color');
    this.colorChecked = getElement('.used-filters__color-value');
    this.resetColor = getElement('.reset-color');
    this.brandBlock = getElement('.used-filters__brand-box');
    this.priceBlock = getElement('.used-filters__price-box');
    this.sizeBlock = getElement('.used-filters__size-box');
    this.sizeChecked = getElement('.used-filters__size-value');
    this.sizeValue = getElements('.sizes-list__item-value');
    this.sizeArray = [];

    this.colorsBlock = getElement('.used-filters__color-box');
    this.lengthBlock = getElement('.used-filters__length-box');
    this.allCheckedFilters = getElement('.used-filters');

    this.sizesList = getElements('.sizes-list__item');

    this.size = '';
    this.resetSize = getElement('.reset-size');

    this.resetAllFilters = getElement('.reset-all-filters');

    this.labels.forEach((label) => {
      label.addEventListener('click', () => {
        this.brand = label.textContent;
        if (this.brandChecked) {
          this.brandChecked.textContent = label.textContent;
          this.brandChecked.nextElementSibling?.classList.add('used-filters__svg_cust_active');
          this.allCheckedFilters?.classList.add('used-filters_active');
          this.brandBlock?.classList.add('used-filters__brand-box_active');
        }
        this.applyFilters();
      });
    });

    this.accordeonButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const button = btn;
        const content = button.nextElementSibling as HTMLElement;
        const span = button.children[1].children[1] as HTMLElement;

        this.toggleFunc(content, span);
      });
    });

    this.lengthLabels.forEach((label) => {
      label.addEventListener('click', () => {
        this.length = label.textContent;
        if (this.lengthChecked) {
          this.lengthChecked.textContent = label.textContent;
          this.lengthChecked.nextElementSibling?.classList.add('used-filters__svg_cust_active');
          this.allCheckedFilters?.classList.add('used-filters_active');
          this.lengthBlock?.classList.add('used-filters__length-box_active');
        }
        this.applyFilters();
      });
    });

    this.colors.forEach((color) => {
      color.addEventListener('click', () => {
        color.classList.add('color_active');
        const copyColorBlock = color.cloneNode(true) as HTMLElement;
        this.allCheckedFilters?.classList.add('used-filters_active');
        this.colorsBlock?.classList.add('used-filters__color-box_active');
        this.colorChecked?.nextElementSibling?.classList.add('used-filters__svg_cust_active');

        const existingColorBlock = this.colorChecked?.querySelector(`[data-color="${copyColorBlock.getAttribute('data-color')}"]`);
        if (!existingColorBlock) {
          this.colorChecked?.appendChild(copyColorBlock);
        }
      });
    });

    this.sizesList.forEach((size) => {
      size.addEventListener('click', () => {
        let string = '';
        size.children[1].classList.add('custom-radio_active');
        // console.log(size.children[2]);
        if (size.children[2] && size.children[2].textContent !== null) {
          string = size.children[2].textContent;
          this.sizeArray?.push(string);
        }
        // console.log(this.sizeArray);
        size.classList.toggle('sizes-list__item_checked');
        const copySizeValue = size.cloneNode(true) as HTMLElement;
        this.allCheckedFilters?.classList.add('used-filters_active');
        this.sizeBlock?.classList.add('used-filters__size-box_active');
        this.sizeChecked?.nextElementSibling?.classList.add('used-filters__svg_cust_active');

        const textContent = copySizeValue.children[2].textContent;
        if (textContent !== null) {
          const existingTextBlock = this.sizeChecked?.querySelector(`[data-size="${textContent}"]`);
          if (!existingTextBlock) {
            const newTextBlock = document.createElement('p');
            newTextBlock.textContent = textContent;
            newTextBlock.setAttribute('data-size', textContent);
            this.sizeChecked?.appendChild(newTextBlock);
          }
        }
      });

      this.applyFilters();
    });

    if (this.rangeSlider) {
      this.initializeSlider();
      this.changeInputs();
    }

    this.resetAllFilters?.addEventListener('click', () => {
      this.brand = null;
      this.length = null;
      this.minPrice = null;
      this.maxPrice = null;
      this.filteredCards = [...this.shopDb];
      this.allCheckedFilters?.classList.remove('used-filters_active');
      this.renderCards();
    });

    this.resetSize?.addEventListener('click', () => {
      this.sizeBlock?.classList.remove('used-filters__size-box_active');
      if (this.sizeChecked) {
        this.sizeChecked.innerHTML = '';
      }
    });

    this.resetColor?.addEventListener('click', () => {
      this.colorsBlock?.classList.remove('used-filters__color-box_active');
      if (this.colorChecked) {
        this.colorChecked.innerHTML = '';
      }
    });

    this.resetBrand?.addEventListener('click', () => {
      this.brand = null;
      this.brandBlock?.classList.remove('used-filters__brand-box_active');
      this.applyFilters();
    });

    this.resetLength?.addEventListener('click', () => {
      this.length = null;
      this.lengthBlock?.classList.remove('used-filters__length-box_active');
      this.applyFilters();
    });

    this.resetPrice?.addEventListener('click', () => {
      this.minPrice = null;
      this.maxPrice = null;
      this.priceBlock?.classList.remove('used-filters__price-box_active');
      this.applyFilters();
    });

    this.filterSvg?.addEventListener('click', () => {
      this.filterForms?.classList.add('catalog__filter-forms_active');
      this.filterSvg?.classList.add('catalog__filter-svg_unvis');
      this.closeFilterForms?.classList.add('catalog__filter-close-filters_visible');
    });

    this.closeFilterForms?.addEventListener('click', () => {
      this.filterForms?.classList.remove('catalog__filter-forms_active');
      this.filterSvg?.classList.remove('catalog__filter-svg_unvis');
      this.closeFilterForms?.classList.remove('catalog__filter-close-filters_visible');
    });

    // this.filteredCards.forEach((item) => {
    //   console.log(Object.values(item.data.size.arrayValue.values)[0].stringValue);
    // })
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

  applyFilters() {
    this.filteredCards = [...this.shopDb];

    // for (const item of this.filteredCards) {
    //   const valuesArray = item.data.size.arrayValue.values.map((obj: { stringValue: string }) => obj.stringValue);
    //   console.log(valuesArray);
    // }

    if (this.brand) {
      this.filteredCards = this.filteredCards.filter((card) => {
        return card.data.brand.stringValue.toLocaleLowerCase() === this.brand!.trim();
      });
    }

    if (this.length) {
      this.filteredCards = this.filteredCards.filter((card) => {
        return card.data.length.stringValue === this.length!.trim();
      });
    }

    if (this.minPrice !== null && this.maxPrice !== null) {
      // this.allCheckedFilters?.classList.add('used-filters_active');
      this.filteredCards = this.filteredCards.filter((card) => {
        const price = parseFloat(card.data.cost.stringValue);
        return price >= this.minPrice! && price <= this.maxPrice!;
      });
    }

    console.log(this.sizeArray)

    if (this.sizeArray) {
      this.filteredCards = this.filteredCards.filter((card) => {
        const valuesArray = card.data.size.arrayValue.values.map((obj: { stringValue: string }) => obj.stringValue);
        console.log(this.sizeArray)
        console.log(valuesArray)
        return this.sizeArray?.every((size) => valuesArray.includes(size));
      });
    }

    if (this.filteredCards.length === 0) {
      shopBlock?.classList.add('catalog__shop_no-cards');
      nothing?.classList.add('nothing_active');
    } else {
      shopBlock?.classList.remove('catalog__shop_no-cards');
      nothing?.classList.remove('nothing_active');
    }

    this.renderCards();
  }

  renderCards() {
    if (clothersWrapper) {
      clothersWrapper.innerHTML = '';
      console.log('wrapper is here');
      this.filteredCards.forEach((item) => {
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
                  <div class="card__colors-list colors-list">
                    <div class="color color__black" data-color="#292a2d">
                      <input type="radio" id="black" name="color" />
                      <div class="custom-radio"></div>
                    </div>
                    <div class="color color__light-rose" data-color="#f3ece2">
                      <input type="radio" id="light-rose" name="color" />
                      <div class="custom-radio"></div>
                    </div>
                    <div class="color color__dark-blue" data-color="#24426a">
                      <input type="radio" id="dark-blue" name="color" />
                      <div class="custom-radio"></div>
                    </div>
                  </div>
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
      // this.allCheckedFilters?.classList.add('used-filters_active');
      const inputElement = this.inputs[handle];
      if (inputElement) {
        inputElement.value = String(Math.round(values[handle]));
        if (handle === 0) {
          this.minPrice = Math.round(values[handle]);
          if (this.minPriceChecked) {
            this.minPriceChecked.textContent = `${this.minPrice} EUR`;
            // this.minPriceChecked.nextElementSibling?.classList.add('used-filters__svg_cust_active');
            if (this.inputFirst?.value) {
              if (Number(this.inputFirst.value) > 50) {
                this.allCheckedFilters?.classList.add('used-filters_active');
                this.priceBlock?.classList.add('used-filters__price-box_active');
                this.priceChecked?.nextElementSibling?.classList.add('used-filters__svg_cust_active');
              }
            }
          }
        } else {
          this.maxPrice = Math.round(values[handle]);
          if (this.maxPriceChecked) {
            this.maxPriceChecked.textContent = `${this.maxPrice} EUR`;
            if (this.inputSecond?.value) {
              if (Number(this.inputSecond.value) < 1000) {
                this.allCheckedFilters?.classList.add('used-filters_active');
              }
            }
          }
        }
        this.applyFilters();
      }
    });
  }

  setRangeSlider(inputIndex: number, value: number) {
    const array: (number | null)[] = [null, null];
    array[inputIndex] = value;
    this.rangeSlider.noUiSlider.set(array);
  }

  changeInputs() {
    this.inputs.forEach((input, index) => {
      input?.addEventListener('change', (event) => {
        const target = event.currentTarget as HTMLInputElement;
        if (target) {
          this.setRangeSlider(index, parseFloat(target.value));
          // if ((this.minPrice !== null && this.minPrice > 51) || (this.maxPrice !== null && this.maxPrice < 1000)) {
          //   this.allCheckedFilters?.classList.add('used-filters_active');
          // }
          this.applyFilters();
        }
      });
    });
  }
}
