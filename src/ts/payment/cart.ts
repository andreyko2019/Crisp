// export interface CartItem {
//   id: string;
//   // name: string;
//   price: number;
//   quantity: number;
//   imageUrl: string;
//   size: string;
//   img: { stringValue: string };
//   imgWebP: { stringValue: string };
//   name: { stringValue: string };
// }
import { OneDressBag } from "../components/interface";

export interface CartItem {
  id: string;
  // name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size: string;
  data: OneDressBag;
}

export class Cart {
  private cart: CartItem[];

  constructor() {
    this.cart = this.loadCart();
  }

  addToCart(item: CartItem) {
    const alreadyInCart = this.cart.find((cartItem) => cartItem.id === item.id && cartItem.size === item.size);

    if (alreadyInCart) {
      alreadyInCart.quantity += item.quantity;
      alreadyInCart.price += item.price * item.quantity;
    } else {
      this.cart.push(item);
    }

    this.saveCart();
  }

  removeFromCart(itemId: string, size: string) {
    this.cart = this.cart.filter((cartItem) => cartItem.id !== itemId || cartItem.size !== size);
    this.saveCart();
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
}
