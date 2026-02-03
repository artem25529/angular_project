import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { UrlService } from './url.service';
import { ProductFilters } from '../models/product-filters';
import { Params, Router } from '@angular/router';
import { SharedDataService } from './shared-data.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = 'http://localhost:3000/products';

  constructor(
    private http: HttpClient,
    private urlService: UrlService,
    private router: Router,
    private sharedDataService: SharedDataService,
  ) {}

  getAll(query?: string, productFilters?: ProductFilters): Observable<Product[]> {
    this.setUrlSearchParams(query, productFilters);
    const queryParams = this.parseQueryAndFilters(query, productFilters);
    const targetUrl = this.urlService.buildUrl(this.url, undefined, queryParams);
    return this.http.get<Product[]>(targetUrl);
  }

  getById(id: number): Observable<Product> {
    const targetUrl = this.urlService.buildUrl(this.url, [String(id)]);
    return this.http.get<Product>(targetUrl);
  }

  update(product: Product) {
    const targetUrl = this.urlService.buildUrl(this.url, [String(product.id)]);
    return this.http.patch<Product>(targetUrl, product);
  }

  deleteById(id: number): Observable<Product> {
    const targetUrl = this.urlService.buildUrl(this.url, [String(id)]);
    return this.http.delete<Product>(targetUrl);
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
