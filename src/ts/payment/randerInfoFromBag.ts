import { getElement, getElements } from '../composables/useCallDom';
import { AddToBag } from '../one-product/add-to-bag';
import { Cart, CartItem } from './cart';


export class RenderInfoFromBag extends AddToBag {
  countAllProducts: HTMLElement | null;
  totalAmount: HTMLElement | null;
  discountButton: HTMLElement | null;
  discountInput: HTMLInputElement | null;
  discountCodes: Array<string>;
  orderSummaryMethods: HTMLElement | null;
  shippingMethod: HTMLElement | null;
  shippingInfo: HTMLElement | null;
  payMethodChecks: NodeListOf<HTMLElement> | null;

  constructor() {
    super();
    this.countAllProducts = getElement('.order-summary-count');
    this.totalAmount = getElement('.order-summary-total');
    this.discountButton = getElement('.discount__button');

    this.discountInput = getElement('#discount-code') as HTMLInputElement;
    this.shippingMethod = getElement('.order-summary-method');
    this.shippingInfo = getElement('.order-summary-shipping');

    this.payMethodChecks = getElements('.pay-method__check');
    this.orderSummaryMethods = getElement('.order-summary-method-box');

    this.discountCodes = ['aa1221', 'aa4354', 'aa5467', 'A98e', 'Cp2112', 'At54', 'Re32'];

    this.renderCartItemsOnPaymentPage();

    this.discountButton?.addEventListener('click', () => {
      this.validateDiscount();
    });

    this.payMethodChecks.forEach((check) => {
      check.addEventListener('click', (event) => {
        this.payMethodChecks?.forEach((payCheck) => {
          payCheck.classList.remove('pay-method__check_checked');
        });

        check.classList.add('pay-method__check_checked');
        this.orderSummaryMethods?.classList.add('order-summary-method-box_active');

        const payMethodBox = (event.target as HTMLElement).closest('.pay-method__box');
        if (payMethodBox) {
          const priceElement = payMethodBox.querySelector('.pay-method__number');
          const infoElements = payMethodBox.querySelectorAll('.pay-method__info');

          if (priceElement && this.shippingInfo) {
            this.shippingInfo.textContent = `Shipping  ${priceElement.textContent}`;
          }

          if (infoElements.length >= 2 && this.shippingMethod) {
            this.shippingMethod.textContent = `${infoElements[1].textContent} - ${infoElements[0].textContent}`;
          }
        }
      });
    });
  }

  updateItemCount(count: number) {
    if (this.countAllProducts) {
      this.countAllProducts.textContent = `${count} item in cart`;
    }
  }

  updateTotalAmount(total: number) {
    if (this.totalAmount) {
      this.totalAmount.textContent = `Order Total ${total.toFixed(2)} EUR`;
    }
  }

  validateDiscount() {
    const discountCode = this.discountInput?.value.trim();
    if (discountCode && this.discountCodes.includes(discountCode)) {
      this.discountInput?.classList.remove('discount__input_error');
      this.applyDiscount();
    } else {
      if (this.discountInput) {
        this.discountInput.value = 'There is an invalid code';
        this.discountInput.classList.add('discount__input_error');
      }
    }
  }

  applyDiscount() {
    const cart = new Cart();
    const total = cart.getTotal();
    const discountedTotal = total * 0.9;
    this.updateTotalAmount(discountedTotal);
  }

  renderCartItemsOnPaymentPage() {
    const cartItemsContainer = document.getElementById('cart-items-container');

    if (cartItemsContainer) {
      const cart = new Cart();
      const cartItems = cart.getCartItems();
      let cartHTML = '';

      console.log('Cart items:', cartItems);

      if (cartItems.length === 0) {
        cartHTML = '<p>Your cart is empty.</p>';
      } else {
        cartItems.forEach((item: CartItem) => {
          console.log('Rendering item:', item);
          const name = item.data.name.stringValue;
          cartHTML += `
            <div class="cart-item">
              <picture>
                <source srcset=${item.data.imgWebP.stringValue} type="image/webp" />
                <img src=${item.data.img.stringValue} class="cart-item-img"/>
              </picture>
              <div class="cart-item-details">
                <p class="cart-item-name">${name}</p>
                <p class="cart-item-size">Size: ${item.size || 'N/A'}</p>
                <p class="cart-item-qty">QTY: ${item.quantity}</p>
                <p class="cart-item-price">${item.price.toFixed(2)} EUR</p>
              </div>
            </div>
          `;
        });
      }

      cartItemsContainer.innerHTML = cartHTML;
      this.updateItemCount(cartItems.length);
      this.updateTotalAmount(cart.getTotal());
    }
  }
}
