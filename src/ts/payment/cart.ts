
import { OneDressBag } from "../components/interface";
// import { getElement } from "../composables/useCallDom";
import { RenderInfoFromBag } from "./randerInfoFromBag";

export interface CartItem {
  id: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size: string;
  data: OneDressBag;
}


export class Cart {
  private cart: CartItem[];
  countItem: number;
  constructor() {
    this.cart = this.loadCart();
    this.countItem = this.cart.length;
  }

  addToCart(item: CartItem) {
    const alreadyInCart = this.cart.find((cartItem) => cartItem.id === item.id && cartItem.size === item.size);

    if (alreadyInCart) {
      alreadyInCart.quantity += item.quantity;
      alreadyInCart.price += item.price * item.quantity;
    } else {
      this.cart.push(item);
    }

    this.countItem = this.cart.length;
    this.saveCart();
    this.updateCartInfo();
  }

  removeFromCart(itemId: string, size: string) {
    this.cart = this.cart.filter((cartItem) => cartItem.id !== itemId || cartItem.size !== size);
    this.countItem = this.cart.length;
    this.saveCart();
    this.updateCartInfo();
  }

  getCartItems(): CartItem[] {
    return this.cart;
  }

  getTotal(): number {
    return this.cart.reduce((total, item) => total + item.price, 0);
  }

  private saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(this.cart));
  }

  private loadCart(): CartItem[] {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
  }

 
  private updateCartInfo() {
    const renderInfo = new RenderInfoFromBag();
    renderInfo.updateItemCount(this.countItem);
    renderInfo.updateTotalAmount(this.getTotal());
  }
}

