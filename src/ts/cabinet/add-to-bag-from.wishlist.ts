import { OneDressBag } from '../components/interface';
import { getElement, renderElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';

const bagList = getElement('.bag__list') as HTMLElement;
const bagContent = getElement('.pop-up__list') as HTMLElement;
const totalSumElement = getElement('.summ span span') as HTMLElement;

export class AddToBagFromWishlist {
  clotherInfo: { id: string; data: OneDressBag } | null;
  cart: { id: string; size: string; quantity: number; price: number; data: OneDressBag }[];
  private lastClickTime: number = 0;
  private wishlistContainer: HTMLElement | null;

  constructor() {
    this.clotherInfo = null;
    this.cart = this.loadCart();
    this.wishlistContainer = getElement('.wishlist__all-cards') as HTMLElement;
    this.init();
  }

  init() {
    if (this.wishlistContainer) {
      this.wishlistContainer.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const card = this.getCurrentCard(target);
        if (target.classList.contains('add-to-cart') && card) {
          this.handleAddToBagClick(card);
        }
      });
    }

    this.initAddAllToBagButton();
  }

  getCurrentCard(target: HTMLElement): HTMLElement | null {
    let element: HTMLElement | null = target;

    while (element && !element.classList.contains('card')) {
      element = element.parentElement as HTMLElement;
    }

    return element;
  }

  private getLastClassValue(element: HTMLElement): string | null {
    const classList = element.className.split(' ');
    return classList.length > 0 ? classList[classList.length - 1] : null;
  }

  private async handleAddToBagClick(card: HTMLElement) {
    const now = Date.now();
    if (now - this.lastClickTime < 3000) {
      return;
    }
    this.lastClickTime = now;
    const itemId = this.getLastClassValue(card);
    if (itemId) {
      await this.fetchWishlistItem(itemId);
      if (this.clotherInfo) {
        this.addToList(card);
      }
    }
  }

  private async fetchWishlistItem(itemId: string) {
    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/clothers/${itemId}`;

    const response = await fetchComposable<{ name: string; fields: OneDressBag }, null>(url, {
      method: 'GET',
    });

    if (response.error) {
      console.error('Error fetching document:', response.error);
      return;
    }

    if (response.data) {
      this.clotherInfo = {
        id: itemId,
        data: response.data.fields,
      };
      console.log(this.clotherInfo);
    }
  }

  private addToList(card: HTMLElement) {
    if (this.clotherInfo) {
      const itemClassID = this.clotherInfo.id;
      const itemClassSize = this.selectedSize();
      const [itemQuantityText, itemPriceText] = this.count(card);
      const itemPrice = parseFloat(itemPriceText.replace(' EUR', '').replace(',', '.'));
      const itemQuantity = Number(itemQuantityText);

      if (bagList && !bagList?.classList.contains('active')) {
        bagList.classList.add('active');
      }

      const existingItem = this.cart.find((item) => item.id === itemClassID && item.size === itemClassSize);

      if (existingItem) {
        existingItem.quantity += itemQuantity;
        existingItem.price = itemPrice * existingItem.quantity;
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
    if (this.clotherInfo) {
      return this.clotherInfo.data.size.arrayValue.values[0].stringValue;
    }

    return '';
  }

  private count(card: HTMLElement): [string, string] {
    const countElement = card.querySelector('.card__add-to-bag .count') as HTMLElement;
    const priceElement = card.querySelector('.card__price') as HTMLElement;

    const count = countElement ? countElement.innerText.trim() : '1';
    const price = priceElement ? priceElement.innerText.trim() : '0.00 EUR';

    return [count, price];
  }

  private saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(this.cart));
  }

  private loadCart() {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
  }

  private renderCart() {
    if (bagContent) {
      bagContent.innerHTML = '';

      if (this.cart.length === 0) {
        const emptyMessage = renderElement('p', 'empty-cart-message');
        emptyMessage.textContent = 'Your bag is empty.';
        bagContent.appendChild(emptyMessage);
      } else {
        this.cart.forEach((item) => {
          const card = renderElement('div', 'prod-in-bag') as HTMLElement;

          const oneItem = renderElement('a', ['clother', item.id, item.size]) as HTMLAnchorElement;
          oneItem.href = `one-product.html?id=${item.id}`;

          const img = renderElement('div', 'clother__img') as HTMLElement;
          img.innerHTML = `
          <picture>
            <source srcset=${item.data.imgWebP.stringValue} type="image/webp" />
            <img src=${item.data.img.stringValue} alt="img">
          </picture>
        `;

          const info = renderElement('div', 'clother__info') as HTMLElement;

          const name = renderElement('p', 'clother__name') as HTMLElement;
          name.textContent = item.data.name.stringValue;

          const size = renderElement('p', 'clother__size') as HTMLElement;
          size.innerHTML = `Size: <span>${item.size}</span>`;

          const articul = renderElement('p', 'clother__art') as HTMLElement;
          articul.innerHTML = `
          Art.No.: <span>434536465<span>
        `;

          const count = renderElement('p', 'clother__count') as HTMLElement;
          count.innerHTML = `
          ${item.quantity} x ${(item.price / item.quantity).toFixed(2)} EUR
        `;

          const close = renderElement('div', 'clother__remove') as HTMLElement;
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
    const removeBtn = item.querySelector('.clother__remove') as HTMLElement;

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        console.log('Removing clother');
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

  private async addAllToBag() {
    if (this.wishlistContainer) {
      const cards = this.wishlistContainer.querySelectorAll('.card') as NodeListOf<HTMLElement>;

      for (const card of cards) {
        const itemId = this.getLastClassValue(card);
        if (itemId) {
          await this.fetchWishlistItem(itemId);
          if (this.clotherInfo) {
            this.addToList(card);
          }
        }
      }
    }
  }

  private initAddAllToBagButton() {
    const addAllButton = getElement('.wishlist__add') as HTMLElement;

    if (addAllButton) {
      addAllButton.addEventListener('click', () => {
        this.addAllToBag();
      });
    }
  }
}
