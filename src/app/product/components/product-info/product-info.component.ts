import { Component, Input } from '@angular/core';
import { Product } from '@product/models/product';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-product-info',
  standalone: false,
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.scss',
})
export class ProductInfoComponent {
  @Input() product!: Product;

  constructor(public authService: AuthService) {}
}
