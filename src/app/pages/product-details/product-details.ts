import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { ReviewService } from '../../core/services/review.service';
import { Product } from '../../core/models/product';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Review } from '../../core/models/review';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
  ) {}

  product$!: Observable<Product>;
  reviews$!: Observable<Review[]>;

  ngOnInit() {
    const productId = +this.activatedRoute.snapshot.params['id'];

    this.product$ = this.productService.getById(productId);
    this.reviews$ = this.reviewService.getAllByProductId(productId);
  }
}
