import { Component, OnDestroy, OnInit } from '@angular/core';
import { range } from 'lodash';
import { CartItem } from '@cart/models/cart-item';
import { Cart } from '@cart/models/cart';
import { CartService } from '@cart/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartPage implements OnInit, OnDestroy {
  constructor(private cartService: CartService) {}

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
    this.cart = this.cartService.cart();
    this.cartItems = this.cart ? this.cart.products : [];

    this.initData();
  }

  initData() {
    this.pageCount = this.calculatePageCount();
    this.startIdx = (this.page - 1) * this.limit;
    this.endIdx = this.calculateEndIdx();
    this.visibleIndexes = this.createVisibleIndexes();
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

  ngOnDestroy() {
    if (this.modified) {
      const sortedIndexes = [...this.removedIndexes].sort((a, b) => b - a);

      sortedIndexes.forEach((val) => {
        this.cartItems.splice(val, 1);
      });

      this.cartService.pushState();
    }
  }
}
