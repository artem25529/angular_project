import { Injectable } from '@angular/core';
import { SharedDataService } from '@core/services/shared-data.service';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  constructor(private sharedDataService: SharedDataService) {}

  handleError<T>(defaultValue: T) {
    return (source: Observable<T>) =>
      source.pipe(
        catchError((err) => {
          this.sharedDataService.updateNotificationSubject({ type: 'error', message: err.message });
          return of(defaultValue);
        }),
      );
  }
}
