import { ChangeDetectorRef, Component, HostBinding, Input } from '@angular/core';
import { Product } from '../../models/product';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input()
  product!: Product;
  deleted = false;

  @HostBinding('style.display')
  get display() {
    return this.deleted ? 'none' : null;
  }

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService,
  ) {}

  deleteProduct() {
    this.productService.deleteById(this.product.id).subscribe(() => {
      this.deleted = true;
      this.cdr.markForCheck();
    });
  }
}
