import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { Product } from '@product/models/product';
import { CartService } from '@cart/services/cart.service';

@Component({
  selector: 'app-add-to-cart-button',
  standalone: false,
  templateUrl: './add-to-cart-button.component.html',
  styleUrl: './add-to-cart-button.component.scss',
})
export class AddToCartButtonComponent implements OnInit, OnDestroy {
  constructor(private cartService: CartService) {}

  @Input() product!: Product;

  private changeCountSubject = new Subject<number>();
  private subscription!: Subscription;

  itemsInCartCount = 0;

  ngOnInit() {
    this.initData();
    this.initSubscriptions();
  }

  initData() {
    if (this.cartService.cart()) {
      const cartItem = this.cartService.cart()!.products.find((i) => i.id === this.product.id);

      this.itemsInCartCount = cartItem ? cartItem.count : 0;
    }
  }

  initSubscriptions() {
    this.subscription = this.changeCountSubject
      .pipe(debounceTime(300))
      .subscribe((count) => this.cartService.addProduct(this.product, count));
  }

  changeCount(increase: boolean = true) {
    if (increase) {
      this.itemsInCartCount++;
    } else {
      this.itemsInCartCount--;
    }

    this.changeCountSubject.next(this.itemsInCartCount);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
