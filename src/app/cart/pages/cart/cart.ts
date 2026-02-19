import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { range } from 'lodash';
import { CartService } from '@cart/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartPage implements OnDestroy {
  private cartService = inject(CartService);
  private cart = this.cartService.cart;

  modified = false;
  limit = 5;

  page = signal(1);
  cartItems = computed(() => {
    const currCart = this.cart();

    if (!currCart) {
      return [];
    }

    return currCart.products;
  });

  pageCount = computed(() => {
    return Math.ceil(this.cartItems().length / this.limit);
  });

  visibleIndexes = computed(() => {
    const startIdx = (this.page() - 1) * this.limit;
    const endIdx = Math.min(startIdx + this.limit, this.cartItems().length);

    if (endIdx > startIdx) {
      return this.createIndexes(startIdx, endIdx);
    } else {
      return [];
    }
  });

  removeItem(idx: number) {
    this.modified = true;

    if (this.visibleIndexes().length === 1 && this.page() > 1) {
      this.changePage(this.page() - 1);
    }

    this.cartService.cart.update((curr) => {
      if (!curr) {
        return curr;
      }

      const updatedProducts = [...curr.products];
      updatedProducts.splice(idx, 1);

      return { ...curr, products: updatedProducts };
    });
  }

  changePage(page: number) {
    this.page.set(page);
  }

  createIndexes(start: number, end: number) {
    return range(start, end);
  }

  ngOnDestroy() {
    if (this.modified) {
      this.cartService.pushState();
    }
  }
}
