import { Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { User } from '@auth/models/user';
import { CartService } from '@cart/services/cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private userService: UserService,
    private cartService: CartService,
  ) {}

  private localStorageUserKey = 'user';

  loggedInUser: WritableSignal<User | null> = signal<User | null>(
    localStorage.getItem(this.localStorageUserKey)
      ? JSON.parse(localStorage.getItem(this.localStorageUserKey)!)
      : null,
  );

  login({ id, email }: User) {
    const user = { id, email };

    this.setUser(user);

    this.cartService.getByUserId(user.id!).subscribe((cart) => {
      if (cart) {
        this.cartService.setCart(cart);
      } else {
        this.cartService.createForUser(user.id!).subscribe((cart) => {
          if (cart) {
            this.cartService.setCart(cart);
          }
        });
      }
    });

    this.router.navigate(['']);
  }

  signup(user: User) {
    this.userService.create(user).subscribe((user) => {
      if (user) {
        this.login(user);
      }
    });
  }

  logout() {
    this.cartService.clearCart();
    this.clearUser();

    this.router.navigate(['auth']);
  }

  setUser(user: User) {
    this.loggedInUser.set(user);
    localStorage.setItem(this.localStorageUserKey, JSON.stringify(user));
  }

  clearUser() {
    this.loggedInUser.set(null);
    localStorage.removeItem(this.localStorageUserKey);
  }
}
