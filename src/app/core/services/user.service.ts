import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '@auth/models/user';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService,
  ) {}

  private url = 'http://localhost:3000/users';

  getByEmail(email: string): Observable<User | null> {
    const options = { params: { email } };

    return this.http
      .get<User[]>(this.url, options)
      .pipe(
        map((users) => {
          return users.length ? users[0] : null;
        }),
      )
      .pipe(this.errorHandlingService.handleError<User | null>(null));
  }

  create(user: User): Observable<User | null> {
    return this.http
      .post<User>(this.url, user)
      .pipe(this.errorHandlingService.handleError<User | null>(null));
  }
}
