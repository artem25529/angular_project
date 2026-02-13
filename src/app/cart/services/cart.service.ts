import { Injectable, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Cart } from '@cart/models/cart';
import { CartItem } from '@cart/models/cart-item';
import { Product } from '@product/models/product';
import { ErrorHandlingService } from '@core/services/error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService,
  ) {
    this.initData();
  }

  private url = 'http://localhost:3000/carts';
  private localStorageCartKey = 'cart';

  cart!: WritableSignal<Cart | null>;

  private initData() {
    this.cart = signal<Cart | null>(
      localStorage.getItem(this.localStorageCartKey)
        ? JSON.parse(localStorage.getItem(this.localStorageCartKey)!)
        : null,
    );
  }

  getByUserId(userId: number): Observable<Cart | null> {
    const options = { params: { userId } };

    return this.http
      .get<Cart[]>(this.url, options)
      .pipe(map((carts) => (carts.length ? carts[0] : null)))
      .pipe(this.errorHandlingService.handleError<Cart | null>(null));
  }

  createForUser(userId: number): Observable<Cart | null> {
    const cart: Cart = {
      userId,
      products: [],
    };

    return this.http
      .post<Cart>(this.url, cart)
      .pipe(this.errorHandlingService.handleError<Cart | null>(null));
  }

  addProduct(product: Product, count: number) {
    if (!this.cart()) {
      return;
    }

    let updated = true;

    const productInCart = this.cart()!.products.find((p) => p.id === product.id);
    const productInCartIdx = this.cart()!.products.findIndex((p) => p.id === product.id);

    if (productInCart) {
      if (productInCart.count !== count) {
        if (count > 0) {
          productInCart.count = count;
        } else {
          this.cart()!.products.splice(productInCartIdx, 1);
        }
      } else {
        updated = false;
      }
    } else if (count > 0) {
      const newItem: CartItem = {
        id: product.id,
        title: product.title,
        count,
        price: product.price,
      };

      this.cart()?.products.push(newItem);
    } else {
      updated = false;
    }

    if (updated) {
      this.pushState();
    }
  }

  pushState() {
    this.http
      .patch<Cart>(`${this.url}/${this.cart()!.id}`, this.cart())
      .pipe(this.errorHandlingService.handleError<Cart | null>(null))
      .subscribe((cart) => {
        if (cart) {
          console.log('Cart state was pushed to db.', cart);
        } else {
          console.error('Error pushing cart state to db.');
        }
      });
  }

  setCart(cart: Cart) {
    this.cart.set(cart);
    localStorage.setItem(this.localStorageCartKey, JSON.stringify(cart));
  }

  clearCart() {
    this.cart.set(null);
    localStorage.removeItem(this.localStorageCartKey);
  }
}
