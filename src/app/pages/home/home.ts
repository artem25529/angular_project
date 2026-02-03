import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Observable,
  switchMap,
  combineLatest,
  Subscription,
  shareReplay,
  catchError,
  of,
} from 'rxjs';
import { SharedDataService } from '../../core/services/shared-data.service';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product';
import { ValidationService } from '../../core/services/validation.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private sharedDataService: SharedDataService,
    private validationService: ValidationService,
  ) {}

  private foundProductAmonutSubscription!: Subscription;
  products$!: Observable<Product[]>;

  ngOnInit() {
    const queryParams = this.activatedRoute.snapshot.queryParams;

    this.sharedDataService.updateHeaderInputSubject(queryParams['query'] ?? '');
    this.sharedDataService.updateProductFiltersSubject(
      this.validationService.createProductFiltersFromParams(queryParams),
    );

    this.products$ = combineLatest([
      this.sharedDataService.headerInput$,
      this.sharedDataService.productFilters$,
    ]).pipe(
      switchMap(([query, productFilters]) => this.productService.getAll(query, productFilters)),
      shareReplay({ bufferSize: 1, refCount: true }),
      catchError((err) => {
        this.sharedDataService.updateNotificationSubject({
          type: 'error',
          message: err.message,
        });

        return [];
      }),
    );

    this.foundProductAmonutSubscription = this.products$.subscribe((products) =>
      this.sharedDataService.updateFoundProductAmonutSubject(products.length),
    );
  }

  ngOnDestroy() {
    this.foundProductAmonutSubscription.unsubscribe();
  }
}
