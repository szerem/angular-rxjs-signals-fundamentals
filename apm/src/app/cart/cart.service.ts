import { computed, effect, Injectable, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([])

  cartCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));

  effectLength = effect(() => console.log(`cartItems count = ${this.cartCount()}`));

  subTotal = computed(() => this.cartItems().reduce((acc, item) => acc + item.product.price * item.quantity, 0));

  deliveryFee = computed(() => this.subTotal() < 50 ? 5.99 : 0.00);

  tax = computed(() => Math.round(this.subTotal() * 10.57) / 100);

  totalPrice = computed(() => this.subTotal() + this.deliveryFee() + this.tax());

  addToCart(product: Product) {
    this.cartItems.update(items => [...items, { product, quantity: 1 }]);
  }

}
