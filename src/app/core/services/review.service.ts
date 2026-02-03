import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private url = 'http://localhost:3000/reviews';

  constructor(private http: HttpClient) {}

  getAllByProductId(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(this.url + '?productId=' + productId);
  }
}
