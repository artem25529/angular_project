import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, Subject } from 'rxjs';
import { isEqual } from 'lodash';
import { ProductFilters } from '@product/models/product-filters';
import { User } from '@auth/models/user';
import { Notification } from '@core/models/notification';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  constructor() {}

  searchParams?: Params;
  lastValidatedUser?: Pick<User, 'id' | 'email'>;

  //header input
  private headerInputSubject = new BehaviorSubject<string | undefined>(undefined);

  headerInput$ = this.headerInputSubject.asObservable().pipe(distinctUntilChanged());

  updateHeaderInputSubject(val: string) {
    this.headerInputSubject.next(val);
  }

  headerInputSubjectValue() {
    return this.headerInputSubject.getValue();
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

  //product amount
  private foundProductAmonutSubject = new BehaviorSubject<number | undefined>(undefined);

  foundProductAmonut$ = this.foundProductAmonutSubject.asObservable().pipe(distinctUntilChanged());

  updateFoundProductAmonutSubject(val: number) {
    this.foundProductAmonutSubject.next(val);
  }

  //notification
  private notificationSubject = new Subject<Notification>();

  notification$ = this.notificationSubject.asObservable().pipe(distinctUntilChanged());

  updateNotificationSubject(val: Notification) {
    this.notificationSubject.next(val);
  }

  //deleted product
  private deletedProductSubject = new Subject<number>();

  deletedProduct$ = this.deletedProductSubject.asObservable();

  updateDeletedProductSubject(val: number) {
    this.deletedProductSubject.next(val);
  }
}
