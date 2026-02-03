import { Component } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { ReviewService } from '../../core/services/review.service';
import { Product } from '../../core/models/product';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { Review } from '../../core/models/review';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails {
  constructor(
    activatedRoute: ActivatedRoute,
    productService: ProductService,
    reviewService: ReviewService,
  ) {
    activatedRoute.params.subscribe((params) => {
      const id = +params['id'];

      this.product$ = productService.getById(id);
      this.reviews$ = reviewService.getAllByProductId(id);
    });
  }

  product$?: Observable<Product>;
  reviews$?: Observable<Review[]>;
}
