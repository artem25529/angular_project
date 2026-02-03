import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../core/models/cart-item';
import { range } from 'lodash';
import { AuthService } from '../../core/services/auth.service';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cart } from '../../core/models/cart';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartPage implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  private subscription!: Subscription;

  cart!: Cart | null;
  cartItems!: CartItem[];
  pageCount!: number;
  removedIndexes: number[] = [];
  startIdx!: number;
  endIdx!: number;
  visibleIndexes!: number[];
  page = 1;
  limit = 5;
  modified = false;

  ngOnInit() {
    this.cart = this.authService.cart();
    this.cartItems = this.cart ? this.cart.products : [];

    this.initData();
    this.initSubscription();
  }

  initData() {
    this.pageCount = this.calculatePageCount();
    this.startIdx = (this.page - 1) * this.limit;
    this.endIdx = this.calculateEndIdx();
    this.visibleIndexes = this.createVisibleIndexes();
  }

  initSubscription() {
    this.subscription = this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        if (this.modified) {
          const sortedIndexes = [...this.removedIndexes].sort((a, b) => b - a);

          sortedIndexes.forEach((val) => {
            this.cartItems.splice(val, 1);
          });

          this.authService.syncCart(this.authService.cart()!);
        }

        this.subscription.unsubscribe();
      }
    });
  }

  normalizeItems() {
    if (!this.visibleIndexes.length) {
      const amount = this.endIdx - this.startIdx;
      this.cartItems.splice(this.startIdx, amount);

      this.removedIndexes = this.removedIndexes
        .filter((i) => i < this.startIdx || i >= this.endIdx)
        .map((i) => {
          if (i >= this.endIdx) {
            return i - this.endIdx;
          }

          return i;
        });

      if (this.page > 1) {
        this.page--;
      }

      this.initData();
    }
  }

  removeItem(idx: number) {
    this.modified = true;
    this.removedIndexes.push(idx);
    this.visibleIndexes = this.createVisibleIndexes();

    this.normalizeItems();
  }

  createVisibleIndexes() {
    return range(this.startIdx, this.endIdx).filter((i) => !this.removedIndexes.includes(i));
  }

  createIndexes(start: number, end: number) {
    return range(start, end);
  }

  calculatePageCount() {
    return Math.ceil(this.cartItems.length / this.limit);
  }

  calculateEndIdx() {
    return Math.min(this.startIdx + this.limit, this.cartItems.length);
  }

  changePage(page: number) {
    this.page = page;
    this.initData();
  }
}
