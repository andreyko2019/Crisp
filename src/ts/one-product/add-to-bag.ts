import { OneDressBag } from '../components/interface';
import { getElement, getElements, renderElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';

const addToBag = getElement('.bag__add.btn.black');
const bagList = getElement('.bag__list');
const bagContent = getElement('.pop-up__list');

export class AddToBag {
  clotherInfo: { id: string; data: OneDressBag } | null;

  constructor() {
    this.clotherInfo = null;

    this.init();
  }

  init() {
    if (addToBag) {
      addToBag.addEventListener('click', () => {
        this.conectDb();
      });
    }
  }

  private getDocumentIdFromURL(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  private async conectDb() {
    const docId = this.getDocumentIdFromURL();

    if (!docId) {
      console.error('Document ID not found in URL');
      return;
    }

    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/clothers/${docId}`;

    const response = await fetchComposable<{ name: string; fields: OneDressBag }, null>(url, {
      method: 'GET',
    });

    if (response.error) {
      console.error('Error fetching document:', response.error);
      return;
    }

    if (response.data) {
      this.clotherInfo = {
        id: docId,
        data: response.data.fields,
      };
      console.log(this.clotherInfo);
      this.addToList();
    }
  }

  private addToList() {
    if (this.clotherInfo && bagList) {
      const itemClass = `${this.clotherInfo.id} ${this.selectedSize()}`;
      const alreadyInBag = !!getElement(`.clother.${itemClass.split(' ').join('.')}`);

      console.log(alreadyInBag);

      if (!bagList.classList.contains('active')) {
        bagList.classList.add('active');
      }

      if (!alreadyInBag) {
        const oneItem = renderElement('a', ['clother', `${this.clotherInfo.id}`, `${this.selectedSize()}`]) as HTMLAnchorElement;
        oneItem.href = `one-product.html?id=${this.clotherInfo.id}`;

        const img = renderElement('div', 'clother__img');
        img.innerHTML = `
            <picture>
              <source srcset=${this.clotherInfo.data.imgWebP.stringValue} type="image/webp" />
              <img src=${this.clotherInfo.data.img.stringValue} />
            </picture>
        `;

        const info = renderElement('div', 'clother__info');

        const name = renderElement('p', 'clother__name');
        name.textContent = this.clotherInfo.data.name.stringValue;

        const size = renderElement('p', 'clother__size');
        size.innerHTML = `Size: <span>${this.selectedSize()}</span>`;

        const articul = renderElement('p', 'clother__art');
        articul.innerHTML = `
        Art.No.: <span>434536465<span>
        `;

        const count = renderElement('p', 'clother__count');
        count.innerHTML = `
        ${this.count()[0]} x ${this.count()[1]} EUR
        `;

        info.appendChild(name);
        info.appendChild(size);
        info.appendChild(articul);
        info.appendChild(count);

        oneItem.appendChild(img);
        oneItem.appendChild(info);

        bagContent?.appendChild(oneItem);
      } else if (addToBag) {
        const count = getElement(`.clother.${itemClass.split(' ').join('.')} .clother__count`)?.innerText as string;
        const [quantity, price] = this.extractNumbers(count);
        const currentQuantity = Number(this.count()[0]);
        const totalQuantity = quantity + currentQuantity;
        const currentPrice = parseFloat(this.count()[1].replace(',', '.'));
        const totalPrice = price + currentPrice;

        const countBlock = getElement(`.clother.${itemClass.split(' ').join('.')} .clother__count`);
        if (countBlock) {
          countBlock.innerHTML = `
            ${totalQuantity} x ${totalPrice},00 EUR
            `;
        }
      }
    }
  }

  private selectedSize(): string {
    const sizesAll = getElements('.sizes__list label');
    const activeSize: HTMLElement[] = [];

    if (sizesAll) {
      sizesAll.forEach((size) => {
        const radio = size.querySelector<HTMLInputElement>('input[type="radio"]');
        if (radio && radio.checked) {
          activeSize.push(size);
        }
      });
    }

    if (activeSize.length == 0 && this.clotherInfo?.data) {
      return this.clotherInfo.data.size.arrayValue.values[0].stringValue;
    }

    const size = activeSize[0].textContent?.trim().replace(/[\s]+$/, '') as string;
    console.log(size);

    return size;
  }

  private count(): string[] {
    const count = getElement('#buttonCountNumber')?.innerText as string;
    const total = getElement('#calculation')?.innerText as string;

    return [count, total];
  }

  private extractNumbers(text: string): [number, number] {
    const regex = /(\d+)\s*x\s*(\d+,\d+)\s*EUR/;
    const match = text.match(regex);

    if (match) {
      const quantity = parseInt(match[1], 10);
      const price = parseFloat(match[2].replace(',', '.'));
      return [quantity, price];
    }

    throw new Error('Invalid input format');
  }
}
