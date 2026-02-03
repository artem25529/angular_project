import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Subject } from 'rxjs';
import { ProductFilters } from '../models/product-filters';
import { isEqual } from 'lodash';
import { NumberParser } from '@internationalized/number';
import { Params } from '@angular/router';
import { User } from '../models/user';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  constructor(@Inject(LOCALE_ID) locale: string) {
    this.numberParser = new NumberParser(locale);
  }

  numberParser: NumberParser;
  searchParams?: Params;
  lastValidatedUser?: Pick<User, 'id' | 'email'>;

  //header input
  private headerInputSubject = new BehaviorSubject<string | undefined>(undefined);

  headerInput$ = this.headerInputSubject.asObservable().pipe(distinctUntilChanged());

  updateHeaderInputSubject(val: string) {
    this.headerInputSubject.next(val);
  }

  //product filters
  private productFiltersSubject = new BehaviorSubject<ProductFilters | undefined>({});

  productFilters$ = this.productFiltersSubject
    .asObservable()
    .pipe(distinctUntilChanged((prev, curr) => isEqual(prev, curr)));

  updateProductFiltersSubject(val: ProductFilters) {
    this.productFiltersSubject.next(val);
  }

  //product filter to remove
  private productFilterToRemoveSubject = new Subject<string>();

  productFilterToRemove$ = this.productFilterToRemoveSubject.asObservable();

  updateProductFilterToRemoveSubject(val: string) {
    this.productFilterToRemoveSubject.next(val);
  }

  private foundProductAmonutSubject = new BehaviorSubject<number | undefined>(undefined);

  foundProductAmonut$ = this.foundProductAmonutSubject.asObservable().pipe(distinctUntilChanged());

  updateFoundProductAmonutSubject(val: number) {
    this.foundProductAmonutSubject.next(val);
  }

  private notificationSubject = new Subject<Notification>();

  notification$ = this.notificationSubject.asObservable().pipe(distinctUntilChanged());

  updateNotificationSubject(val: Notification) {
    this.notificationSubject.next(val);
  }
}
