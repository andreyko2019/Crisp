import { AddToBag } from '../one-product/add-to-bag';
import { Cart, CartItem } from './cart';

export class RenderInfoFromBag extends AddToBag {
  constructor() {
    super();
    this.renderCartItemsOnPaymentPage();
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
    }
  }
}
