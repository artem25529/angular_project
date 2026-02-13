import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from '@product/services/product.service';
import { Product } from '@product/models/product';
import { ReviewService } from '@product/services/review.service';
import { Review } from '@product/models/review';

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

  product$!: Observable<Product | null>;
  reviews$!: Observable<Review[]>;

  ngOnInit() {
    const productId = +this.activatedRoute.snapshot.params['id'];

    this.product$ = this.productService.getById(productId);
    this.reviews$ = this.reviewService.getAllByProductId(productId);
  }
}
