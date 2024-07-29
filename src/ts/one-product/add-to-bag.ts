import { OneDressBag } from '../components/interface';
import { getElement, getElements, renderElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';

const addToBag = getElement('.bag__add.btn.black');
const bagList = getElement('.bag__list');
const bagContent = getElement('.pop-up__list');
const totalSumElement = getElement('.summ span span');

export class AddToBag {
  clotherInfo: { id: string; data: OneDressBag } | null;
  cart: { id: string; size: string; quantity: number; price: number; data: OneDressBag }[];
  private lastClickTime: number = 0;

  constructor() {
    this.clotherInfo = null;
    this.cart = this.loadCart();

    this.init();
  }

  init() {
    if (addToBag) {
      addToBag.addEventListener('click', () => {
        this.handleAddToBagClick();
      });
    }
    this.renderCart();
  }

  private handleAddToBagClick() {
    const now = Date.now();
    if (now - this.lastClickTime < 3000) {
      return;
    }
    this.lastClickTime = now;
    this.conectDb();
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
      this.addToList();
    }
  }

  private addToList() {
    if (this.clotherInfo && bagList) {
      const itemClassID = this.clotherInfo.id;
      const itemClassSize = this.selectedSize();
      const itemPrice = parseFloat(this.clotherInfo.data.cost.stringValue.replace(',', '.'));
      const itemQuantity = Number(this.count()[0]);

      const alreadyInBag = this.cart.find((item) => item.id === itemClassID && item.size === itemClassSize);

      if (!bagList.classList.contains('active')) {
        bagList.classList.add('active');
      }

      if (alreadyInBag) {
        alreadyInBag.quantity += itemQuantity;
        alreadyInBag.price += itemPrice * itemQuantity;
      } else {
        this.cart.push({
          id: itemClassID,
          size: itemClassSize,
          quantity: itemQuantity,
          price: itemPrice * itemQuantity,
          data: this.clotherInfo.data,
        });
      }

      this.saveCart();
      this.renderCart();
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

    return size;
  }

  private count(): string[] {
    const count = getElement('#buttonCountNumber')?.innerText as string;
    const total = getElement('#calculation')?.innerText as string;

    return [count, total];
  }

   renderCart() {
    if (bagContent) {
      bagContent.innerHTML = '';

      if (this.cart.length === 0) {
        const emptyMessage = renderElement('p', 'empty-cart-message');
        emptyMessage.textContent = 'Your bag is empty.';
        bagContent?.appendChild(emptyMessage);
      } else {
        this.cart.forEach((item) => {
          const card = renderElement('div', 'prod-in-bag');

          const oneItem = renderElement('a', ['clother', item.id, item.size]) as HTMLAnchorElement;
          oneItem.href = `one-product.html?id=${item.id}`;

          const img = renderElement('div', 'clother__img');
          img.innerHTML = `
          <picture>
            <source srcset=${item.data.imgWebP.stringValue} type="image/webp" />
            <img src=${item.data.img.stringValue} />
          </picture>
        `;

          const info = renderElement('div', 'clother__info');

          const name = renderElement('p', 'clother__name');
          name.textContent = item.data.name.stringValue;

          const size = renderElement('p', 'clother__size');
          size.innerHTML = `Size: <span>${item.size}</span>`;

          const articul = renderElement('p', 'clother__art');
          articul.innerHTML = `
          Art.No.: <span>434536465<span>
        `;

          const count = renderElement('p', 'clother__count');
          count.innerHTML = `
          ${item.quantity} x ${(item.price / item.quantity).toFixed(2)} EUR
        `;

          const close = renderElement('div', 'clother__remove');
          close.innerHTML = `
          <svg>
            <use href="#remove"></use>
          </svg>
        `;

          info.appendChild(name);
          info.appendChild(size);
          info.appendChild(articul);
          info.appendChild(count);

          oneItem.appendChild(img);
          oneItem.appendChild(info);

          card.appendChild(oneItem);
          card.appendChild(close);

          bagContent.appendChild(card);

          this.removeClother(card, item);
        });
      }

      this.updateTotal();
    }
  }

  private removeClother(item: HTMLElement, cartItem: { id: string; size: string }) {
    const removeBtn = item.querySelector('.clother__remove');

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        this.cart = this.cart.filter((cartItemInCart) => cartItemInCart.id !== cartItem.id || cartItemInCart.size !== cartItem.size);
        item.remove();
        this.saveCart();
        this.updateTotal();
      });
    }
  }

  private updateTotal() {
    const total = this.cart.reduce((acc, item) => acc + item.price, 0);
    if (totalSumElement) {
      totalSumElement.textContent = total.toFixed(2);
    }
  }

  private saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(this.cart));
  }

  private loadCart() {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
  }
}
