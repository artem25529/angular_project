import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UrlService } from './url.service';
import { Cart } from '../models/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private url = 'http://localhost:3000/carts';

  constructor(
    private http: HttpClient,
    private urlService: UrlService,
  ) {}

  getByUserId(userId: number): Observable<Cart | null> {
    const targetUrl = this.urlService.buildUrl(this.url, undefined, { userId: String(userId) });
    return this.http.get<Cart[]>(targetUrl).pipe(map((carts) => (carts.length ? carts[0] : null)));
  }

  createForUser(userId: number): Observable<Cart> {
    const cart: Cart = {
      userId,
      products: [],
    };

    return this.http.post<Cart>(this.url, cart);
  }

  update(cart: Cart): Observable<Cart> {
    const targetUrl = this.urlService.buildUrl(this.url, [String(cart.id)]);
    return this.http.patch<Cart>(targetUrl, cart);
  }
}
