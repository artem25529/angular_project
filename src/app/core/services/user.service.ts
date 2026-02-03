import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UrlService } from './url.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient,
    private urlService: UrlService,
  ) {}

  getByEmail(email: string): Observable<User | null> {
    const targetUrl = this.urlService.buildUrl(this.url, undefined, { email });
    return this.http.get<User[]>(targetUrl).pipe(
      map((users) => {
        return users?.length ? users[0] : null;
      }),
    );
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.url, user);
  }
}
