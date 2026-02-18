import { Component, Input } from '@angular/core';
import { Product } from '@product/models/product';
import { ProductService } from '@product/services/product.service';
import { AuthService } from '@auth/services/auth.service';
import { SharedDataService } from '@core/services/shared-data.service';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input()
  product!: Product;

  constructor(
    private productService: ProductService,
    private sharedDataService: SharedDataService,
    public authService: AuthService,
  ) {}

  deleteProduct() {
    this.productService.deleteById(this.product.id).subscribe(() => {
      this.sharedDataService.updateDeletedProductSubject(this.product.id);
      this.sharedDataService.updateNotificationSubject({
        type: 'success',
        message: `Product ${this.product.id} was removed successfully.  `,
      });
    });
  }
}
