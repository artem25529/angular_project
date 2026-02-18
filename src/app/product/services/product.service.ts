import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Params, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { SharedDataService } from '@core/services/shared-data.service';
import { Product } from '@product/models/product';
import { ProductFilters } from '@product/models/product-filters';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { CartService } from '@cart/services/cart.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedDataService: SharedDataService,
    private errorHandlingService: ErrorHandlingService,
    private cartService: CartService,
  ) {}

  private url = 'http://localhost:3000/products';

  getAll(query?: string, productFilters?: ProductFilters): Observable<Product[]> {
    this.setUrlSearchParams(query, productFilters);
    const queryParams = this.parseQueryAndFilters(query, productFilters);
    const options = { params: queryParams };

    return this.http
      .get<Product[]>(this.url, options)
      .pipe(this.errorHandlingService.handleError<Product[]>([]));
  }

  getById(id: number): Observable<Product | null> {
    return this.http
      .get<Product>(`${this.url}/${id}`)
      .pipe(this.errorHandlingService.handleError<Product | null>(null));
  }

  update(product: Product): Observable<Product | null> {
    return this.http
      .patch<Product>(`${this.url}/${product.id}`, product)
      .pipe(this.errorHandlingService.handleError<Product | null>(null));
  }

  deleteById(id: number): Observable<Product | null> {
    return this.http
      .delete<Product>(`${this.url}/${id}`)
      .pipe(
        tap((res) => {
          if (res) {
            this.cartService.removeProductFromCarts(id);
          }
        }),
      )
      .pipe(this.errorHandlingService.handleError<Product | null>(null));
  }

  private setUrlSearchParams(query?: string, productFilters?: ProductFilters) {
    const queryParams: Params = {};

    if (productFilters) {
      const filterKeys = Object.keys(productFilters) as Array<keyof ProductFilters>;

      filterKeys.forEach((key) => {
        if (productFilters[key]) {
          queryParams[key] = productFilters[key];
        }
      });
    }

    if (query) {
      queryParams['query'] = query;
    }

    this.sharedDataService.searchParams = queryParams;

    this.router.navigate([], { queryParams });
  }

  private parseQueryAndFilters(
    query?: string,
    productFilters?: ProductFilters,
  ): { [key: string]: string } {
    const queryParams: { [key: string]: string } = {};

    if (query && query.trim().length > 0) {
      queryParams['q'] = query.trim();
    }

    if (productFilters) {
      const { rating, price, hasReviews, inStock } = productFilters;

      if (rating) {
        const values = rating.split('|');

        if (values[0]) {
          queryParams['rating.rate_gte'] = values[0];
        }

        if (values[1]) {
          queryParams['rating.rate_lte'] = values[1];
        }
      }

      if (price) {
        const values = price.split('|');

        if (values[0]) {
          queryParams['price_gte'] = values[0];
        }

        if (values[1]) {
          queryParams['price_lte'] = values[1];
        }
      }

      if (hasReviews) {
        queryParams['rating.count_gte'] = '1';
      }

      if (inStock) {
        queryParams['stock_gte'] = '1';
      }
    }

    return queryParams;
  }
}
