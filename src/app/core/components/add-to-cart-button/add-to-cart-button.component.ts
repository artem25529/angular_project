import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product';
import { Cart } from '../../models/cart';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-add-to-cart-button',
  standalone: false,
  templateUrl: './add-to-cart-button.component.html',
  styleUrl: './add-to-cart-button.component.scss',
})
export class AddToCartButtonComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}

  @Input() product!: Product;

  private changeCountSubject = new Subject<number>();
  private subscription!: Subscription;

  cart!: Cart | null;
  itemsInCartCount!: number;

  ngOnInit() {
    this.initData();
    this.initSubscriptions();
  }

  initData() {
    this.cart = this.authService.cart();

    if (this.cart) {
      const cartItem = this.cart.products.find((i) => i.id === this.product.id);

      this.itemsInCartCount = cartItem ? cartItem.count : 0;
    } else {
      this.itemsInCartCount = 0;
    }
  }

  initSubscriptions() {
    this.subscription = this.changeCountSubject.pipe(debounceTime(300)).subscribe((count) => {
      if (this.cart) {
        const cartItem = this.cart.products.find((i) => i.id === this.product.id);

        if (cartItem) {
          if (cartItem.count !== count) {
            if (count === 0) {
              this.cart.products.splice(
                this.cart.products.findIndex((i) => i.id === this.product.id),
                1,
              );
            } else {
              cartItem.count = count;
            }

            this.authService.syncCart(this.cart);
          }
        } else if (count > 0) {
          this.cart.products.push({
            id: this.product.id,
            title: this.product.title,
            price: this.product.price,
            count: count,
          });

          this.authService.syncCart(this.cart);
        }
      }
    });
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
