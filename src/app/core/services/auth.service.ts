import { Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { CartService } from './cart.service';
import { User } from '../models/user';
import { Cart } from '../models/cart';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private userService: UserService,
    private cartService: CartService,
  ) {
    this.initData();
  }

  private localStorageUserKey = 'user';
  private localStorageCartKey = 'cart';

  loggedInUser!: WritableSignal<User | null>;
  cart!: WritableSignal<Cart | null>;

  private initData() {
    this.loggedInUser = signal<User | null>(
      localStorage.getItem(this.localStorageUserKey)
        ? JSON.parse(localStorage.getItem(this.localStorageUserKey)!)
        : null,
    );

    this.cart = signal<Cart | null>(
      localStorage.getItem(this.localStorageCartKey)
        ? JSON.parse(localStorage.getItem(this.localStorageCartKey)!)
        : null,
    );
  }

  login(user: User) {
    delete user.password;
    this.loggedInUser.set(user);
    localStorage.setItem(this.localStorageUserKey, JSON.stringify(user));

    this.cartService.getByUserId(user.id!).subscribe((cart) => {
      if (cart) {
        this.cart.set(cart);
        localStorage.setItem(this.localStorageCartKey, JSON.stringify(cart));
      } else {
        this.cartService.createForUser(user.id!).subscribe((cart) => {
          this.cart.set(cart);
          localStorage.setItem(this.localStorageCartKey, JSON.stringify(cart));
        });
      }
    });

    this.router.navigate(['']);
  }

  signup(user: User) {
    this.userService.create(user).subscribe((user) => this.login(user));
  }

  logout() {
    localStorage.removeItem(this.localStorageUserKey);
    localStorage.removeItem(this.localStorageCartKey);

    this.loggedInUser.set(null);
    this.cart.set(null);

    this.router.navigate(['auth']);
  }

  syncCart(cart: Cart) {
    if (cart) {
      this.cartService.update(cart).subscribe((res) => {
        localStorage.setItem(this.localStorageCartKey, JSON.stringify(res));
        this.cart.set(res);
      });
    }
  }
}
