import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '@product/models/review';
import { ErrorHandlingService } from '@core/services/error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService,
  ) {}

  private url = 'http://localhost:3000/reviews';

  getAllByProductId(productId: number): Observable<Review[]> {
    const options = { params: { productId } };

    return this.http
      .get<Review[]>(this.url, options)
      .pipe(this.errorHandlingService.handleError<Review[]>([]));
  }
}
